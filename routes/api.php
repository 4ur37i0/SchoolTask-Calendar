<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\Task;

Route::post('/moodle-import', function (Request $request) {
    $request->validate([
        'url' => 'required|url',
        'username' => 'required|string',
        'password' => 'required|string',
    ]);

    // Aquí conectarías con Moodle usando los datos del usuario
    // Ejemplo simulado:
    $tasksFromMoodle = [
        ['course_name' => 'Matemáticas', 'title' => 'Tarea 1', 'due_date' => '2025-10-15'],
        ['course_name' => 'Física', 'title' => 'Tarea 2', 'due_date' => '2025-10-18'],
    ];

    foreach ($tasksFromMoodle as $task) {
        Task::updateOrCreate(
            ['title' => $task['title'], 'course_name' => $task['course_name']],
            $task
        );
    }

    return response()->json(['message' => 'Tareas importadas correctamente']);
});


Route::get('/tasks', function () {
    return Task::all();
});
