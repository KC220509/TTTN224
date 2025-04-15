<?php

namespace App\Services;

use App\Models\User;

class UserService
{
    protected $userModel;
    public function __construct(User $userModel)
    {
        $this->userModel = $userModel;
    }

    public function getUser($id){
        return User::where('user_id', $id)->first();
    }

    public function getListAcc(){
        return User::where('role_id', '!=',1)->get();
    }

    
}