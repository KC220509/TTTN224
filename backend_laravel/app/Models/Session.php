<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    use HasFactory;

    protected $fillable = ['operator_id', 'device_id', 'status', 'detail'];

    public function operator()
    {
        return $this->belongsTo(User::class, 'operator_id');
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function histories()
    {
        return $this->hasMany(History::class);
    }
}

