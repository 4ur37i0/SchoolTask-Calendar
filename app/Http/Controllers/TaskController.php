<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function getTasks() {
        return response()->json(Task::all());
    }

    public function changeStatus(Request $request) {
        $title = $request->input('title');
        $course = $request->input('course');
        $status = $request->input('status');
        $taskDate = $request->input('date');
        $task = Task::where('title', $title)
                ->where('course', $course)
                ->first();

        $now = Carbon::now()->subHour('5');
        $dueDate = Carbon::parse($taskDate)->format('Y-m-d');
        $newStatus = $status;

        switch ($status) {
            case 'atrasado':
            case 'pendiente':
                $newStatus = 'hecho';
                break;

            case 'hecho':
                if ($now->lessThan($dueDate)) {
                    $newStatus = 'pendiente'; 
                } else {
                    $newStatus = 'atrasado'; 
                }
                break;
        }

        $task->status = $newStatus;
        $task->save();

        return response()->json([
            'newStatus' => $newStatus
        ], 200);
    }
}
