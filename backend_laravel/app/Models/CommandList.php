<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandList extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'commands'];

    public function profiles()
    {
        return $this->hasMany(Profile::class);
    }
}

