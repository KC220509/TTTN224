<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Admin\AddUserRequest;
use App\Http\Requests\Api\Admin\ResetPassRequest;
use App\Http\Requests\Api\Admin\UpdatePassRequest;
use App\Models\Role;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AdminController extends Controller
{
   protected $userService;
   public function __construct(UserService $userService)
   {
       $this->userService = $userService;
   }

  

   public function getListUser(){
        
        $users = $this->userService->getListAcc();

        $users = $users->map(function ($user) {
            $role = $this->getRoleUser($user->role_ID); // Gọi hàm bên dưới
            $user->roleName = $role->role_name ?? 'Unknown'; // Lấy roleName từ response JSON
            return $user;
        });
        if (!$users) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }
        return response()->json([
            'message' => 'List user',
            'users' => $users,
            'roleList' => Role::where('role_id', '!=', 1)->get(), 
        ], 200);
   }

   public function getRoleUser($role_id){
    $roleUser = Role::where('role_id', $role_id)->first();

    return $roleUser; 

    }   

   public function createUser(AddUserRequest $addUserRequest){
        $request = $addUserRequest->validated();
        $user = new User();
        $user->username = $request['username'];
        $user->email = $request['email'];
        $user->password = Hash::make($request['password']);
        $user->role_ID = $request['role_ID'];
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Create user successfully',
            'user' => $user,
        ], 200);
   }

   public function updatePass(UpdatePassRequest $updatePassRequest){
        $request = $updatePassRequest->validated();
        $user = User::find(Auth::id());
        if (!$user) {
            return response()->json([
                'error' => 'Vui lòng đăng nhập !',
            ], 404);
        }
        if (!Hash::check($request['old_password'], $user->password)) {
            return response()->json([
                'error' => 'Sai mật khẩu cũ. Vui lòng thử lại !',
            ], 400);
        }
        $user->password = Hash::make($request['new_password']);
        $user->save();
        // Xóa token cũ

        return response()->json([
            'success' => true,
            'message' => 'Mật khẩu cập nhật thành công',
            'user' => $user,
        ], 200);
   }

   public function ResetPass(ResetPassRequest $resetPassRequest){
        $request = $resetPassRequest->validated();
        $user = User::where('email', $request['email'])->first();
        if (!$user) {
            return response()->json([
                'error' => 'Email không tồn tại !',
            ], 404);
        }
        $new_password = Str::random(8); 
        $user->password = Hash::make($new_password);
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Mật khẩu đã được làm mới thành công',
            'email' => $user->email,
            'new_password' => $new_password,
        ], 200);
   }
}