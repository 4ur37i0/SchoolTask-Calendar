<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $auth_ud = Auth::id();
        $taskData['pendientes'] = Task::where('status', 'pendiente')->where('user_id', $auth_ud)->count(); 
        $taskData['atrasadas'] = Task::where('status', 'atrasado')->where('user_id', $auth_ud)->count(); 
        $proximaTarea = Task::where('due_date', '>', Carbon::now())
                            ->where('user_id', $auth_ud)
                            ->where('status', 'pendiente')
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
