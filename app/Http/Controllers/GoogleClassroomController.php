<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Task;
use App\Models\Platform;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class GoogleClassroomController extends Controller
{
    public function sync(Request $request)
    {
        $accessToken = $request->input('access_token');
        
        try {
            if (empty($accessToken)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token de acceso no proporcionado.'
                ], 400);
            }

            $userResponse = Http::withToken($accessToken)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if ($userResponse->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Error al obtener informacion del usuario.'
                ], 400);
            }

            $user = $userResponse->json();
            $email = $user['email'] ?? 'desconocido';

            $coursesResponse = Http::withToken($accessToken)
                ->get('https://classroom.googleapis.com/v1/courses');

            if ($coursesResponse->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudieron obtener los cursos de Google Classroom.'
                ], 400);
            }

            $courses = $coursesResponse->json()['courses'] ?? [];
            $count = 0;

            // Ejecutar solicitudes paralelas para todos los cursos
            $responses = Http::pool(fn ($pool) =>
                collect($courses)->map(fn ($course) =>
                    $pool->withToken($accessToken)
                        ->get("https://classroom.googleapis.com/v1/courses/{$course['id']}/courseWork")
                )->toArray()
            );

            Platform::updateOrCreate(
                [
                    'url' => 'https://classroom.google.com',
                    'name' => 'Google Classroom',
                    'user_id' => Auth::id(),
                ],
                [
                    'type' => 'Google Classroom',
                    'default_color' => '#00a63e',
                    'token' => 'No Token',
                ]
            );

            $classroomPlatform = Platform::where('name', 'Google Classroom')->where('user_id', Auth::id())->first();


            // Procesar las respuestas paralelas
            foreach ($responses as $index => $tasksResponse) {
                if (!$tasksResponse || $tasksResponse->failed()) continue;

                $tasks = $tasksResponse->json()['courseWork'] ?? [];
                $course = $courses[$index];
                $courseId = $course['id'];
                $courseName = $course['name'];

                foreach ($tasks as $task) {

                    if (!isset($task['title']) || !isset($task['dueDate'])) continue;
                    $tsk = Task::where('title', $task['title'])
                        ->where('course', $courseName)
                        ->first();
                    if ($tsk) continue; // si ya existe la tarea

                    $dueDate = null;
                    if (isset($task['dueDate'])) {
                        $date = $task['dueDate'];
                        $hour = 23;
                        $minute = 59;

                        if (isset($task['dueTime'])) {
                            $hour = $task['dueTime']['hours'] ?? 0;
                            $minute = $task['dueTime']['minutes'] ?? 0;
                        }

                        $dueDateCarbon = Carbon::create(
                            $date['year'],
                            $date['month'],
                            $date['day'],
                            $hour,
                            $minute,
                            0
                        )->subHours(6);

                        $dueDate = $dueDateCarbon->toDateTimeString();
                    }

                    // limitar a traer tareas mas antiguas que 3 meses
                    $ThreeMonthsAgo = Carbon::now()->subMonth(3);
                    if (!$dueDate || Carbon::parse($dueDate)->lessThan($ThreeMonthsAgo)) continue;

                    $status = Carbon::parse($dueDate)->isAfter(Carbon::now())
                        ? 'pendiente'
                        : 'atrasado';

                    Task::updateOrCreate(
                        [
                            'title' => $task['title'],
                            'course' => $courseName,
                        ],
                        [
                            'due_date' => $dueDate,
                            'status' => $status,
                            'source_type' => 1,//platform
                            'priority' => 2,//medium
                            'user_id' => Auth::id(),
                            'platform_id' => $classroomPlatform->id, // se asignará después de crear o actualizar la plataforma
                        ]
                    );

                    $count++;
                }
            }


            return response()->json([
                'success' => true,
                'message' => "Tareas sincronizadas correctamente desde Google Classroom para {$email}. Se importaron {$count} tareas."
            ]);
        } catch (Exception $e) {
            Log::error('Error al sincronizar Classroom: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Error inesperado: ' . $e->getMessage()
            ], 500);
        }
    }
}