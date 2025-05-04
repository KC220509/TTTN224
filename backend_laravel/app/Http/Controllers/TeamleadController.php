<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\Teamlead\AddDeviceRequest;
use App\Http\Requests\Api\Teamlead\AddDvGroupRequest;
use App\Models\Device;
use App\Models\DeviceGroup;
use App\Services\DeviceService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Process\Exceptions\ProcessFailedException;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\Process\Process;


class TeamleadController extends Controller
{
    protected $userService;
    protected $deviceService;
    public function __construct(UserService $userService, DeviceService $deviceService)
    {
        $this->userService = $userService;
        $this->deviceService = $deviceService;
    }

    public function getListDevice($user_id)
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $devices = $this->deviceService->getDevice($user_id);
        if (!$devices) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại thiết bị nào',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách thiết bị',
            'devices' => $devices,
        ], 200);
    }

    public function checkDevice(Request $request)
    {
        $device_name = $request->name;
        $sever_ip = $request->ip_address;

        $port = $request->ssh_port; // Cổng mặc định SSH
        $timeout = 2; // Thời gian chờ kết nối (2 giây)
        $errno = 0;
        $errstr = '';

        // Cố gắng kết nối với máy qua cổng SSH
        try {
            $check = @fsockopen($sever_ip, $port, $errno, $errstr, $timeout);

            if ($check) {
                fclose($check);

                $device_ip = $this->getIPDevice($device_name);
                return response()->json([
                    'status' => 'online',
                    'ip' => $device_ip,
                    'port' => $port
                ]);
            } else {
                return response()->json([
                    'status' => 'offline',
                    'ip' => $sever_ip,
                    'port' => $port,
                    'error' => $errstr,
                    'code' => $errno
                ]);
            }
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Connection failed: ' . $e->getMessage()
            ], 500);
        }
    }   
    // Hàm để lấy IP container
    private function getIPDevice($deviceName)
    {
        $process = new Process([
            'docker', 'inspect', '-f', '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}', $deviceName
        ]);

        try {
            $process->mustRun();
            $ip = trim($process->getOutput());
            return $ip ?: null;
        } catch (ProcessFailedException $e) {
            return null;
        }
    }

    public function createDevice(AddDeviceRequest $addDeviceRequest)
    {
        $request = $addDeviceRequest->validated();
        
        $device = new Device();
        $device->name = $request['name'];
        $device->ip_address = $request['ip_address'];
        $device->ssh_port = $request['ssh_port'];
        $device->user_ID = $request['user_ID'];
        $device->save();
        if(!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Thêm thiết bị không thành công',
            ], 500);
        }
        return response()->json([
            'success' => true,
            'message' => 'Thêm thiết bị thành công',
            'device' => $device
        ], 200);
    }


    public function getListGroupDevice($user_id)
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $groups = DeviceGroup::where('user_ID', $user_id)->get();
        if (!$groups) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại nhóm thiết bị nào',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách nhóm thiết bị',
            'groups' => $groups,
        ], 200);
    }

    public function createGroupDevice(AddDvGroupRequest $addDvGroupRequest)
    {
        $request = $addDvGroupRequest->validated();

        // Tạo nhóm thiết bị mới
        $group = new DeviceGroup();
        $group->name = $request['name'];
        $group->user_ID = $request['user_ID'];

        $group->save();

        if (!$group) {
            return response()->json([
                'success' => false,
                'message' => 'Tạo nhóm thiết bị không thành công',
            ], 500);
        }
        $deviceIds = collect($request['deviceList'])->pluck('device_id')->toArray();

        // Gán thiết bị vào nhóm thông qua quan hệ nhiều-nhiều
        $group->devices()->attach($deviceIds);

        return response()->json([
            'success' => true,
            'message' => 'Tạo nhóm thiết bị thành công',
            'group' => $group
        ], 200);

    }
}
