<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class History extends Model
{
    use HasFactory;

    protected $fillable = ['session_id', 'time', 'device_id'];

    public function session()
    {
        return $this->belongsTo(Session::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}

