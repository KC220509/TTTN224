<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\TeamleadController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Sanctum;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
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
});

