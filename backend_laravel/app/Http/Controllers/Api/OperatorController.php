<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use App\Models\ProfileOperator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
}
