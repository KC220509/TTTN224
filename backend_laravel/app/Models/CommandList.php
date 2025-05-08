<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandList extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 
        'description',
        'commands',
        'user_ID',
    ];
    protected $casts = [
        'commands' => 'array',
    ];
    

    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}

