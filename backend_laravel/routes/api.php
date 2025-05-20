<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\OperatorController;
use App\Http\Controllers\Api\TeamleadController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;


Route::post('login', [AccountController::class, 'loginAction'])->name('login');

Route::post('/reset-pass-admin', [AccountController::class, 'AdminResetPass'])->name('resetPassAdmin');
Route::post('/reset-pass', [AccountController::class, 'resetPass'])->name('resetPassUser');

Route::middleware(['auth:sanctum', 'check_role:1'])->prefix('admin')->group(function () {
    Route::get('/user{user_id}', [AccountController::class, 'index'])->name('index');
    Route::get('/list-user', [AdminController::class, 'getListUser'])->name('getListUser');
    Route::post('/create-user', [AdminController::class, 'createUser'])->name('createUser');



    Route::patch('/update-profile-pass', [AdminController::class, 'updatePass'])->name('updateUser');
});


Route::middleware(['auth:sanctum', 'check_role:2'])->prefix('teamlead')->group(function () {
    Route::get('/user{user_id}', [AccountController::class, 'index'])->name('tl_index');
    Route::get('/list-device/{user_id}', [TeamleadController::class, 'getListDevice'])->name('getListDevice');
    Route::post('/check-device', [TeamleadController::class, 'checkDevice'])->name('checkDevice');
    Route::post('/create-device', [TeamleadController::class, 'createDevice'])->name('createDevice');

    Route::get('/list-group/{user_id}', [TeamleadController::class, 'getListGroupDevice'])->name('getListGroupDevice');
    Route::post('/create-group', [TeamleadController::class, 'createGroupDevice'])->name('createGroupDevice');

    Route::get('/list-command/{user_id}', [TeamleadController::class, 'getListCommand'])->name('getListCommand');
    Route::post('/create-command', [TeamleadController::class, 'createCommandList'])->name('createCommandList');

    Route::get('/list-profile/{user_id}', [TeamleadController::class, 'getListProfile'])->name('getListProfile');
    Route::get('/list-operator', [TeamleadController::class, 'getListOperator'])->name('getListOperator');
    
    Route::get('/list-profile-operator/{user_id}', [TeamleadController::class, 'getListProfileOperator'])->name('getListProfileOperator');
    Route::post('/create-profile', [TeamleadController::class, 'createProfile'])->name('createProfile');
    Route::post('/assign-profiles-operator', [TeamleadController::class, 'assignProfileOperator'])->name('assignProfileOperator');
    Route::post('/assign-operators-profile', [TeamleadController::class, 'assignOperatorProfile'])->name('assignOperatorProfile');

});

Route::middleware(['auth:sanctum', 'check_role:3'])->prefix('operator')->group(function () {
    Route::get('/user{user_id}', [AccountController::class, 'index'])->name('op_index');
    Route::get('/list-profile/{user_id}', [OperatorController::class, 'getListProfile'])->name('op_getListProfile');
    Route::get('/list-device-assign', [OperatorController::class, 'getlistDeviceAssign'])->name('op_getlistDeviceAssign');
});