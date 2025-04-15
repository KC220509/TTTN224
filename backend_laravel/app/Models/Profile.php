<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'command_list_id', 'device_group_id'];

    public function commandList()
    {
        return $this->belongsTo(CommandList::class);
    }

    public function deviceGroup()
    {
        return $this->belongsTo(DeviceGroup::class);
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'profile_user');
    }
}

