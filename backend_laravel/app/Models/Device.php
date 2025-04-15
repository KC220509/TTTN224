<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'ip_address'];

    public function deviceGroups()
    {
        // return $this->belongsToMany(DeviceGroup::class, 'device_group_device');
    }

    public function sessions()
    {
        // return $this->hasMany(Session::class);
    }
}

