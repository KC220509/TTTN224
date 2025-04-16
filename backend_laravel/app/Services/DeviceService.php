<?php

namespace App\Services;

use App\Models\Device;

class DeviceService
{
    protected $deviceModel;
    public function __construct(Device $deviceModel)
    {
        $this->deviceModel = $deviceModel;
    }

    public function getDevice($user_id){
        return Device::where('user_ID', $user_id)->get();
    }

}