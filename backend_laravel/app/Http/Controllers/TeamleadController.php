<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\Teamlead\AddDeviceRequest;
use App\Models\Device;
use App\Services\DeviceService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

    public function createDevice(AddDeviceRequest $addDeviceRequest)
    {
        $request = $addDeviceRequest->validated();
        
        $device = new Device();
        $device->name = $request['name'];
        $device->ip_address = $request['ip_address'];
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
}
