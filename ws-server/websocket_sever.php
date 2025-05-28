<?php
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

require __DIR__ . '/../backend_laravel/vendor/autoload.php';

class SshTerminal implements MessageComponentInterface
{
    protected $clients;
    protected $connections; 

    public function __construct() {
        $this->clients = new \SplObjectStorage;
        $this->connections = [];
        echo "SSH WebSocket server started\n";
    }

    public function onOpen(ConnectionInterface $conn) {
        // Thêm client WebSocket mới
        $this->clients->attach($conn);
        echo "New connection! ({$conn->resourceId})\n";
    }

    public function onMessage(ConnectionInterface $conn, $msg) {
        // Client gửi dữ liệu JSON: { action, username, password, host, port, data }
        $data = json_decode($msg, true);
        if (!$data) {
            $conn->send(json_encode(['error' => 'Invalid JSON']));
            return;
        }

        if (!isset($this->connections[$conn->resourceId])) {
            // Lần đầu, tạo kết nối SSH nếu có đủ thông tin
            if (isset($data['action']) && $data['action'] === 'connect') {
                $this->handleConnect($conn, $data);
            } else {
                $conn->send(json_encode(['error' => 'Please send connect action first']));
            }
            return;
        }

        // Nếu đã có ssh connection, gửi dữ liệu nhập từ client vào SSH
        if (isset($data['action']) && $data['action'] === 'input') {
            $this->handleInput($conn, $data['data']);
        }
    }

    public function onClose(ConnectionInterface $conn) {
        echo "Connection {$conn->resourceId} has disconnected\n";

        // Đóng SSH channel nếu có
        if (isset($this->connections[$conn->resourceId])) {
            $ssh = $this->connections[$conn->resourceId]['ssh'];
            // Ensure $conn has resourceId property
            if (!property_exists($conn, 'resourceId')) {
                $conn->send(json_encode(['error' => 'Invalid connection object']));
                return;
            }
            $shell = $this->connections[$conn->resourceId]['shell'];
            fclose($shell);
            ssh2_disconnect($ssh);
            unset($this->connections[$conn->resourceId]);
        }

        $this->clients->detach($conn);
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "An error has occurred: {$e->getMessage()}\n";
        $conn->close();
    }

    protected function handleConnect(ConnectionInterface $conn, $data) {
        $host = $data['host'] ?? null;
        $port = $data['port'] ?? 22;
        $username = $data['username'] ?? null;
        $password = $data['password'] ?? null;

        if (!$host || !$username || !$password) {
            $conn->send(json_encode(['error' => 'Missing connection info']));
            return;
        }

        // Kết nối SSH
        $ssh = @ssh2_connect($host, $port);
        if (!$ssh) {
            $conn->send(json_encode(['error' => 'Cannot connect SSH server']));
            return;
        }

        if (!@ssh2_auth_password($ssh, $username, $password)) {
            $conn->send(json_encode(['error' => 'SSH authentication failed']));
            return;
        }

        // Mở shell PTY
        $shell = ssh2_shell($ssh, 'xterm');
        if (!$shell) {
            $conn->send(json_encode(['error' => 'Cannot open SSH shell']));
            return;
        }

        stream_set_blocking($shell, false);

        $this->connections[$conn->resourceId] = [
            'ssh' => $ssh,
            'shell' => $shell,
        ];

        $conn->send(json_encode(['success' => 'Connected to SSH server']));

        // Bắt đầu đọc dữ liệu từ SSH shell và gửi về client
        $this->startShellReadLoop($conn);
    }

    protected function handleInput(ConnectionInterface $conn, $input) {
        if (!isset($this->connections[$conn->resourceId])) {
            $conn->send(json_encode(['error' => 'Not connected']));
            return;
        }
        $shell = $this->connections[$conn->resourceId]['shell'];
        fwrite($shell, $input);
    }

    protected function startShellReadLoop(ConnectionInterface $conn) {
        $shell = $this->connections[$conn->resourceId]['shell'];
        $self = $this;

        // Dùng timer event đọc dữ liệu không đồng bộ
        $loop = React\EventLoop\Loop::get();

        $loop->addPeriodicTimer(0.1, function () use ($conn, $shell, $self) {
            $output = stream_get_contents($shell);
            if ($output !== false && strlen($output) > 0) {
                $conn->send(json_encode(['output' => $output]));
            }
        });

        $loop->run();
    }
}
