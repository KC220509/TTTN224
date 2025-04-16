<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\Account\LoginRequest;
use App\Models\User;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

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

    

    
}
