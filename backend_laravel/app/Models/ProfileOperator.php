<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProfileOperator extends Model
{
    use HasFactory;

    protected $table = 'profile_operator';
    protected $fillable = [
        'profile_ID',
        'operator_ID',
        'user_ID',
    ];
}
