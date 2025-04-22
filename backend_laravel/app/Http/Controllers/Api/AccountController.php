<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Account\LoginRequest;
use App\Http\Requests\Api\Admin\ResetPassRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AccountController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function LoginAction(LoginRequest $loginRequest)
    {
        $request = $loginRequest->validated();
        $user = User::where('email', $request['email'])->first();

        if ($user && Hash::check($request['password'], $user->password)) {
              
            $token = $user->createToken('api-token')->plainTextToken;

            return response()->json([
                'token' => $token,
                'token_type' => 'Bearer',
                'user' => $user
            ], 200);
        }

        return response()->json([
            'message' => 'Đăng nhâp không thành công',
        ], 401);
    }

    public function index($user_id){
        if(!Auth::check()){
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
        $user = $this->userService->getUser($user_id);
        if (!$user) {
            return response()->json([
                'message' => 'User not found',
            ], 404);
        }

        return response()->json([
            'message' => 'Admin page',
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
