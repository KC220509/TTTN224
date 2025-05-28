<?php
require __DIR__ . '/websocket_sever.php';

use Ratchet\Http\HttpServer;
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;

$terminal = new SshTerminal();

$server = IoServer::factory(
    new HttpServer(
        new WsServer(
            $terminal
        )
    ),
    9000
);

echo "Server started on port 9000\n";

$server->run();
