<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;
    
    protected $primaryKey = 'device_id';

    protected $fillable = [
        'name', 
        'ip_address',
        'user_ID',
    ];
    public function deviceGroups()
    {
        return $this->belongsToMany(DeviceGroup::class, 'device_group_device', 'device_ID', 'device_group_ID');
    }
}

