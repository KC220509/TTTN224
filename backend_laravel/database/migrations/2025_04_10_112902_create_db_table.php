<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;



return new class extends Migration {
    public function up(): void
    {
        //Roles
        Schema::create('roles', function (Blueprint $table) {
            $table->id('role_id');
            $table->string('role_name');
            $table->timestamps();
            $table->softDeletes();
        });

        // USERS
        Schema::create('users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('email')->unique(); 
            $table->string('password');
            $table->string('username');
            $table->string('avt_path')->nullable();
            $table->boolean('gender')->default(true); // Mặc định true là nam
            $table->text('description')->nullable();
            $table->unsignedBigInteger('role_ID');  
            $table->boolean('status_acc')->default(true);
            
            // $table->rememberToken();
            $table->timestamps(); 
            $table->softDeletes();

            // Định nghĩa khóa ngoại cho role_id
            $table  ->foreign('role_ID')
                    ->references('role_id')
                    ->on('roles')
                    ->onUpdate('cascade')
                    ->onDelete('cascade');
        });

        // DEVICES
        Schema::create('devices', function (Blueprint $table) {
            $table->id('device_id');
            $table->string('name');
            $table->string('ip_address');
            $table->integer('ssh_port');
            $table->unsignedBigInteger('user_ID');  
            $table->timestamps();

            $table->foreign('user_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
        });

        // DEVICE GROUPS
        Schema::create('device_groups', function (Blueprint $table) {
            $table->id('device_group_id');
            $table->string('name');
            $table->unsignedBigInteger('user_ID');
            $table->timestamps();

            $table->foreign('user_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
        });

        // DEVICE_GROUP_DEVICE (pivot)
        Schema::create('device_group_device', function (Blueprint $table) {
            $table->unsignedBigInteger('device_group_ID');
            $table->unsignedBigInteger('device_ID');
            $table->foreign('device_group_ID') 
                  ->references('device_group_id')
                  ->on('device_groups')
                  ->onDelete('cascade');
            $table->foreign('device_ID')
                  ->references('device_id')
                  ->on('devices')
                  ->onDelete('cascade');
            $table->primary(['device_group_ID', 'device_ID']);
        });

        // COMMAND LISTS
        Schema::create('command_lists', function (Blueprint $table) {
            $table->id('command_list_id');
            $table->string('name');
            $table->string('description')->nullable();
            $table->text('commands');
            $table->unsignedBigInteger('user_ID');  
            $table->timestamps();

            $table->foreign('user_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
        });

        // PROFILES
        Schema::create('profiles', function (Blueprint $table) {
            $table->id('profile_id');
            $table->string('name');
            $table->unsignedBigInteger('command_list_ID');
            $table->unsignedBigInteger('device_group_ID');
            $table->unsignedBigInteger('user_ID');
            $table->foreign('command_list_ID')
                  ->references('command_list_id')
                  ->on('command_lists')
                  ->onDelete('cascade');
            $table->foreign('device_group_ID')
                  ->references('device_group_id')
                  ->on('device_groups')
                  ->onDelete('cascade');
            $table->foreign('user_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->timestamps();
        });

        // PROFILE_USER (pivot)
        Schema::create('profile_operator', function (Blueprint $table) {
            $table->unsignedBigInteger('profile_ID');
            $table->unsignedBigInteger('operator_ID');
            $table->unsignedBigInteger('user_ID');
            $table->foreign('profile_ID')
                  ->references('profile_id')
                  ->on('profiles')
                  ->onDelete('cascade');
            $table->foreign('operator_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->foreign('user_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->primary(['profile_ID', 'operator_ID', 'user_ID']);
        });

        // SESSIONS
        Schema::create('sessions', function (Blueprint $table) {
            $table->id('session_id');
            $table->unsignedBigInteger('operator_ID');
            $table->unsignedBigInteger('device_ID');
            $table->string('status');
            $table->text('detail')->nullable();
            $table->timestamps();

            $table->foreign('operator_ID')
                  ->references('user_id')
                  ->on('users')
                  ->onDelete('cascade');
            $table->foreign('device_ID')
                  ->references('device_id')
                  ->on('devices')
                  ->onDelete('cascade');
        });

        // HISTORIES
        Schema::create('histories', function (Blueprint $table) {
            $table->id('historie_id');
            $table->unsignedBigInteger('session_ID');
            $table->unsignedBigInteger('device_ID');
            $table->timestamp('time');
            $table->timestamps();

            $table->foreign('session_ID')
                  ->references('session_id')
                  ->on('sessions')
                  ->onDelete('cascade');
            $table->foreign('device_ID')
                  ->references('device_id')
                  ->on('devices')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('histories');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('profile_user');
        Schema::dropIfExists('profiles');
        Schema::dropIfExists('command_lists');
        Schema::dropIfExists('device_group_device');
        Schema::dropIfExists('device_groups');
        Schema::dropIfExists('devices');
        Schema::dropIfExists('users');
        Schema::dropIfExists('roles');
    }
};
