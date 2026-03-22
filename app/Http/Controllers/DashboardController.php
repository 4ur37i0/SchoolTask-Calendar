<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $taskData['pendientes'] = Task::where('status', 'pendiente')->count(); 
        $taskData['atrasadas'] = Task::where('status', 'atrasado')->count(); 
        $proximaTarea = Task::where('due_date', '>', Carbon::now())
                            ->orderBy('due_date', 'asc')
                            ->first();
        $taskData['proxima'] = $proximaTarea 
            ? ucfirst(Carbon::parse($proximaTarea->due_date)->translatedFormat('l d F \d\e\l Y') )
            : 'Sin tareas próximas';

        return Inertia::render('dashboard', [
            'taskData' => $taskData, // Pasamos el dato como prop
        ]);
    } 
}
