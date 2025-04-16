<?php

use App\Http\Controllers\Api\AccountController;
use App\Http\Controllers\Api\Admin\AdminController;
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

Route::middleware(['auth:sanctum', 'check_role:1'])->prefix('admin')->group(function () {
    Route::get('/user{user_id}', [AccountController::class, 'index'])->name('index');
    Route::get('/list-user', [AdminController::class, 'getListUser'])->name('getListUser');
    Route::post('/create-user', [AdminController::class, 'createUser'])->name('createUser');



    Route::patch('/update-profile-pass', [AdminController::class, 'updatePass'])->name('updateUser');
    Route::post('/reset-pass', [AdminController::class, 'resetPass'])->name('resetPassAdmin');
});


Route::middleware(['auth:sanctum', 'check_role:2'])->prefix('teamlead')->group(function () {
    Route::get('/user{user_id}', [AccountController::class, 'index'])->name('tl_index');
});

