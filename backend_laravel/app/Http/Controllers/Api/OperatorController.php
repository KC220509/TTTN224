<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Operator\ConnectRequest;
use App\Http\Requests\Api\Operator\SendSshRequest;
use App\Models\Device;
use App\Models\Profile;
use App\Models\ProfileOperator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use phpseclib3\Net\SSH2;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Symfony\Component\Process\Process;

class OperatorController extends Controller
{
    protected $profile, $profileOperator;
    public function __construct(Profile $profile, ProfileOperator $profileOperator)
    {
        $this->profile = $profile;
        $this->profileOperator = $profileOperator;
    }


    public function getListProfile($user_id){

        $profile_IDs = $this->profileOperator->where('operator_ID', $user_id)->get('profile_ID');
        $listProfile = DB::table('profiles')
            ->join('device_groups', 'profiles.device_group_ID', '=', 'device_groups.device_group_id')
            ->join('command_lists', 'profiles.command_list_ID', '=', 'command_lists.command_list_id')
            ->whereIn('profiles.profile_id', $profile_IDs)
            ->select(
                'profiles.profile_id',
                'profiles.name as profile_name',
                'device_groups.device_group_id',
                'device_groups.name as device_group_name',
                'command_lists.name as command_list_name'
            )
            ->get();
        if ($listProfile->isEmpty()) {
            return response()->json(['message' => 'No profiles found for this operator.'], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách profile được gán cho operator',
            'listProfile' => $listProfile
        ], 200);
    }


    public function getListDeviceAssign(){
        $listDeviceAssign = DB::table('devices')
            ->join('device_group_device', 'devices.device_id', '=', 'device_group_device.device_ID')
            ->select(
                'devices.device_id',
                'devices.name as device_name',
                'devices.ip_address',
                'devices.ssh_port',
                'device_group_device.device_group_ID',
            )
            ->get();
        if ($listDeviceAssign->isEmpty()) {
            return response()->json(['message' => 'No profiles found for this operator.'], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách profile được gán cho operator',
            'listDeviceAssign' => $listDeviceAssign
        ], 200);
    }



    public function connectDevice(ConnectRequest $connectRequest)
    {
        $request = $connectRequest->validated();
        $username = $request['username'];
        $password = $request['password'];
        $host = $request['host'];
        $port = $request['port'];

        // Lấy thiết bị theo cổng SSH
        $device = Device::where('ssh_port', $port)->first();

      
        // Kết nối SSH để xác thực
        $connection = ssh2_connect($host, $port);
        if (!$connection) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể kết nối đến thiết bị'
            ], 500);
        }
        if (!ssh2_auth_password($connection, $username, $password)) {
            return response()->json([
                'success' => false,
                'message' => 'Xác thực thất bại'
            ], 401);
        }

        $info = [
            'username' => $username,
            'password' => $password,
            'host' => $host,
            'port' => $port,
        ];
        


        return response()->json([
            'success' => true,
            'message' => 'Kết nối thành công và ttyd đã được bật',
            'device_name' => $device->name,
            'info' => $info,
        ], 200);
    }


    public function sendSSHCommand(SendSshRequest $sendSshRequest)
    {
        $request = $sendSshRequest->validated();
        $username = $request['username'];
        $password = $request['password'];
        $host = $request['host'];
        $port = $request['port'];
        $command = $request['command'];

        // Kết nối SSH
        $connection = ssh2_connect($host, $port);
        if (!$connection) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể kết nối đến thiết bị'
            ], 500);
        }

        // Xác thực
        if (!ssh2_auth_password($connection, $username, $password)) {
            return response()->json([
                'success' => false,
                'message' => 'Xác thực thất bại'
            ], 401);
        }

        // Tạo PTY (Pseudo Terminal)
        $stream = ssh2_exec($connection, $command, 'xterm');
        if (!$stream) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể thực thi lệnh'
            ], 500);
        }

        stream_set_blocking($stream, true);
        $output = stream_get_contents($stream);
        fclose($stream);

        return response()->json([
            'success' => true,
            'message' => 'Thực thi thành công',
            'output' => $output,
        ], 200);
    }

}
