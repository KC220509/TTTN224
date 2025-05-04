<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'user_ID',
    ];

    public function devices()
    {
        return $this->belongsToMany(Device::class, 'device_group_device', 'device_group_ID', 'device_ID');
    }

}
