<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\MangroveController;
use App\Http\Controllers\Api\NewsController;
use App\Http\Controllers\Api\PlantationController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\SavedLocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/news', [NewsController::class, 'index']);
Route::get('/news/{id}', [NewsController::class, 'show']);

Route::get('/plantations', [PlantationController::class, 'index']);
Route::get('/plantations/{id}', [PlantationController::class, 'show']);

Route::get('/mangroves', [MangroveController::class, 'index']);
Route::get('/mangroves/{id}', [MangroveController::class, 'show']);

Route::post('/contact', [ContactController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::get('/contact-messages', [ContactController::class, 'index']);

    Route::put('/profile/update', [ProfileController::class, 'update']);
    Route::put('/profile/change-password', [ProfileController::class, 'changePassword']);

    Route::get('/saved-locations', [SavedLocationController::class, 'index']);
    Route::post('/saved-locations', [SavedLocationController::class, 'store']);
    Route::delete('/saved-locations/{id}', [SavedLocationController::class, 'destroy']);
});
