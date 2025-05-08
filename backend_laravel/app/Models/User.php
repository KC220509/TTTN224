<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'users';
    protected $primaryKey = 'user_id';
    protected $fillable = [
        'email',
        'password',
        'username',
        'avt_path',
        'gender',
        'description',
        'role_ID',
        'status_acc'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function profiles()
    {
        return $this->belongsToMany(Profile::class, 'profile_operator', 'operator_ID', 'profile_ID')
                    ->withPivot('user_ID');  // Lưu trữ thông tin về người thực hiện hành động
    }

}
