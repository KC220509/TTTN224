<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Http\Requests\Api\Teamlead\AddCommandListRequest;
use App\Http\Requests\Api\Teamlead\AddDeviceRequest;
use App\Http\Requests\Api\Teamlead\AddDvGroupRequest;
use App\Http\Requests\Api\Teamlead\AddProfileRequest;
use App\Http\Requests\Api\Teamlead\AssignOperatorProfileRequest;
use App\Http\Requests\Api\Teamlead\AssignProfileOperatorRequest;
use App\Models\CommandList;
use App\Models\Device;
use App\Models\DeviceGroup;
use App\Models\Profile;
use App\Models\User;
use App\Services\DeviceService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Process\Exceptions\ProcessFailedException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Laravel\Sail\Console\AddCommand;
use PhpParser\Node\Expr\Assign;
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


    public function getListCommand($user_id)
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $commandLists = CommandList::where('user_ID', $user_id)->get();
        if (!$commandLists) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại danh sách lệnh nào',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách lệnh',
            'command_lists' => $commandLists,
        ], 200);
    }

    public function createCommandList(AddCommandListRequest $addCommandListRequest){
        $request = $addCommandListRequest->validated();

        // Tạo danh sách lệnh mới
        $commandList = new CommandList();
        $commandList->name = $request['name'];
        $commandList->description = $request['description'];
        $commandList->commands = $request['commands'];  // Chuyển đổi mảng thành chuỗi JSON
        $commandList->user_ID = $request['user_ID'];

        if (!$commandList->save()) {
            return response()->json([
                'success' => false,
                'message' => 'Tạo danh sách lệnh không thành công',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo danh sách lệnh thành công',
            'command_list' => $commandList
        ], 200);
    }

    public function getListProfile($user_id)
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $profiles = Profile::where('user_ID', $user_id)->get();
        if (!$profiles) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại profile nào',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách profile',
            'profiles' => $profiles,
        ], 200);
    }

    public function createProfile(AddProfileRequest $addProfileRequest)
    {
        $request = $addProfileRequest->validated();

        // Tạo profile mới
        $profile = new Profile();
        $profile->name = $request['name'];
        $profile->command_list_id = $request['command_list_id'];
        $profile->device_group_id = $request['device_group_id'];
        $profile->user_ID = $request['user_ID'];

        if (!$profile->save()) {
            return response()->json([
                'success' => false,
                'message' => 'Tạo profile không thành công',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Tạo profile thành công',
            'profile' => $profile
        ], 200);

    }


    public function getListOperator()
    {
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $operators = User::where('role_ID', 3)->get();
        if (!$operators) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại operator nào',
            ], 404);
        }
        return response()->json([
            'success' => true,
            'message' => 'Danh sách operator',
            'operators' => $operators,
        ], 200);
    }


    public function assignProfileOperator(AssignProfileOperatorRequest $assignProfileOperatorRequest)
    {
        try{
            
            $request = $assignProfileOperatorRequest->validated();

            // Tìm profile theo ID
            $profile = Profile::find($request['profile_IDs']);
            $operator = User::find($request['operator_ID']);
            if (!$profile || !$operator) {
                return response()->json([
                    'success' => false,
                    'message' => 'Dữ liệu không tồn tại',
                ], 404);
            }


            $profileIds = $request['profile_IDs'];

            // Kiểm tra xem mỗi profile đã được gán chưa
            foreach ($profileIds as $profileId) {
                if (!$operator->profiles->contains('profile_id', $profileId)) {
                    // Gán profile nếu chưa được gán
                    $operator->profiles()->attach($profileId, [
                        'operator_ID' => $request['operator_ID'],  // Cột liên kết với bảng users
                        'user_ID' => $request['user_ID']           // Cột bổ sung về người thực hiện hành động
                    ]);
                }
            }

            return response()->json([
                'success' => true,
                'message' => 'Gán profile cho operator thành công',
            ], 200);
        
        }
        catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Gán profile cho operator không thành công',
                'error' => $e->getMessage()
            ], 500);

        }
    }
    public function assignOperatorProfile(AssignOperatorProfileRequest $assignOperatorProfileRequest)
    {
        try {
            $request = $assignOperatorProfileRequest->validated();

            // Tìm profile theo ID
            $profile = Profile::where('profile_id', $request['profile_ID'])->first();

            if (!$profile) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không tìm thấy profile',
                ], 404);
            }

            $operatorIds = $request['operator_IDs']; // array

            // Lấy danh sách operator đã được gán
            $existingOperatorIds = $profile->users()->pluck('users.user_id')->toArray();

            // Lọc ra những operator chưa được gán
            $newOperatorIds = array_diff($operatorIds, $existingOperatorIds);

            // Gán các operator mới vào profile
            foreach ($newOperatorIds as $operatorId) {
                $profile->users()->attach($operatorId, [
                    'user_ID' => $request['user_ID'] // người thực hiện hành động
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Gán profile cho nhiều operator thành công',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gán profile cho nhiều operator không thành công',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function getListProfileOperator($user_id){
        if (!Auth::check()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
    
        $profileOperators = DB::table('profile_operator')
            ->join('profiles', 'profile_operator.profile_ID', '=', 'profiles.profile_id')
            ->join('users', 'profile_operator.operator_ID', '=', 'users.user_id')
            ->where('profile_operator.user_ID', $user_id)
            ->select(
                'profile_operator.*',
                'profiles.name as profile_name',
                'users.username as operator_name',
                'users.email as operator_email',
                'profiles.command_list_ID',
                'profiles.device_group_ID',
            )
            ->get();
    
        if ($profileOperators->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không tồn tại profile nào',
            ], 404);
        }
    
        return response()->json([
            'success' => true,
            'message' => 'Danh sách profile',
            'profile_operators' => $profileOperators,
        ], 200);
    }

   

}
