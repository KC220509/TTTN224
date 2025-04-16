<?php

namespace App\Http\Controllers;

use App\Http\Requests\Api\Teamlead\AddDeviceRequest;
use App\Services\UserService;
use Illuminate\Http\Request;

class TeamleadController extends Controller
{
    protected $userService;
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    // public function createDevice(AddDeviceRequest $addDeviceRequest)
    // {
    //     $request = $addDeviceRequest->validated();
    //     $device = $this->userService->createDevice($request);
    //     if (!$device) {
    //         return response()->json([
    //             'message' => 'Create device failed',
    //         ], 404);
    //     }
    //     return response()->json([
    //         'message' => 'Create device success',
    //         'device' => $device,
    //     ], 200);
    // }
}
