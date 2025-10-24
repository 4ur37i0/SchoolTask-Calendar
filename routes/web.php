<?php

use App\Http\Controllers\GoogleClassroomController;
use App\Http\Controllers\MoodleController;
use App\Http\Controllers\PlatformController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\TaskController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/calendar', function () {
        return Inertia::render('calendar'); // Carga la página React Platforms.jsx
    });
    Route::get('/platforms', function () {
        return Inertia::render('platforms'); // Carga la página React Platforms.jsx
    });

    Route::put('/moodle/sync', [MoodleController::class, 'fetchAndStoreTasks']);
    Route::put('/moodle/refresh', [MoodleController::class, 'refreshPlatform']);
    Route::put('/classroom/sync', [GoogleClassroomController::class, 'sync']);
    Route::put('/tasks/changeStatus', [TaskController::class, 'changeStatus']);

    Route::get('/tasks', [TaskController::class, 'getTasks']);
    Route::get('/listPlatforms', [PlatformController::class, 'getLocalPlatforms']);
    
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
