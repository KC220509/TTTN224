<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            [
                'username'=>'Admin',
                'email'=>'buiduccong22052003@gmail.com',
                'password'=>Hash::make('admin123'),
                'role_id' => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
        DB::table('users')->insert([
            [
                'username'=>'user1',
                'email'=>'cong@gmail.com',
                'password'=>Hash::make('cong123'),
                'role_id' => 3,
                'created_at' => now(),
                'updated_at' => now(),
            ]
        ]);
    }
}
