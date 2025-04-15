<?php

namespace App\Services;

use App\Models\Role;

class RoleService
{
    protected $roleModel;
    public function __construct(Role $roleModel)
    {
        $this->roleModel = $roleModel;
    }

    public function getRole(){
        return $this->roleModel->where('role_id', '!=', '1')->get();
    }
}