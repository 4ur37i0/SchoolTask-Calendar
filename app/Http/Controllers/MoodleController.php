<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Task;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Exception;

class MoodleController extends Controller
{
    public function fetchAndStoreTasks(Request $request)
    {
        $name = $request->input('name');
        $url = $request->input('url');
        $username = $request->input('username');
        $password = $request->input('password');
        $color = $request->input('color');
        $token = "";

        Log::info('Color recibido desde React:', ['color' => $color]);
        try {
            if (empty($url) || empty($username) || empty($password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Todos los campos son obligatorios.'
                ], 400);
            }

            $resp = Http::get($url . '/login/token.php', [
                'username' => $username,
                'password' => $password,
                'service' => 'moodle_mobile_app'
            ]);

            if ($resp->failed()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo conectar con la URL proporcionada.'
                ], 400);
            }

            $getToken = $resp->json();
            if (!isset($getToken['token'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales incorrectas o usuario no válido.'
                ], 401);
            }

            $token = $getToken['token'];

            $getUserInfo = Http::get($url . '/webservice/rest/server.php', [
                'wstoken' => $getToken['token'],
                'wsfunction' => 'core_webservice_get_site_info',
                'moodlewsrestformat' => 'json'
            ])->json();

            $getCourses = Http::get($url . '/webservice/rest/server.php', [
                'wstoken' => $getToken['token'],
                'wsfunction' => 'core_enrol_get_users_courses',
                'userid' => $getUserInfo['userid'],
                'moodlewsrestformat' => 'json'
            ])->json();

            $count = 0;
            foreach ($getCourses as $course) {
                $courseName = $course['fullname'];
                $getTasks = Http::get($url . '/webservice/rest/server.php', [
                    'wstoken' => $getToken['token'],
                    'wsfunction' => 'core_calendar_get_calendar_events',
                    'moodlewsrestformat' => 'json',
                    'events[courseids][0]' => $course['id']
                ])->json();

                if (!isset($getTasks['events'])) continue;

                foreach ($getTasks['events'] as $task) {
                    $taskDate = Carbon::createFromTimestamp($task['timestart'])->subHours(6);
                    $status = $taskDate->isAfter(Carbon::now()) ? 'pendiente' : 'atrasado';

                    Task::updateOrCreate(
                        [
                            'title' => $task['name'],
                            'course' => $courseName,
                        ],
                        [
                            'due_date' => $taskDate->format('Y-m-d'),
                            'status' => $status,
                            'color_rgb' => $color
                        ]
                    );

                    $count++;
                }
            }

            Platform::updateOrCreate([
                'url' => $url,
            ],[
                'url' => $url,
                'name' => $name,
                'token' => $token
            ]
            );

            return response()->json([
                'success' => true,
                'message' => "Tareas sincronizadas correctamente. Se encontraron {$count} tareas."
            ]);

        } catch (\Exception $e) {
            Log::error("Error general: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error inesperado: ' . $e->getMessage()
            ], 500);
        }
    }

    public function refreshPlatform(Request $request)
    {
        $url = $request->input('url');

        try {
            $platform = \App\Models\Platform::where('url', $url)->first();

            if (!$platform) {
                return response()->json([
                    'success' => false,
                    'message' => 'Plataforma no encontrada.'
                ], 404);
            }

            if (empty($platform->token)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se encontró un token valido para esta plataforma.'
                ], 400);
            }

            $getUserInfo = Http::get($url . '/webservice/rest/server.php', [
                'wstoken' => $platform->token,
                'wsfunction' => 'core_webservice_get_site_info',
                'moodlewsrestformat' => 'json'
            ])->json();

            if (isset($getUserInfo['exception'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'El token ha expirado o es invalido.'
                ], 401);
            }

            // Obtener cursos del usuario
            $getCourses = Http::get($url . '/webservice/rest/server.php', [
                'wstoken' => $platform->token,
                'wsfunction' => 'core_enrol_get_users_courses',
                'userid' => $getUserInfo['userid'],
                'moodlewsrestformat' => 'json'
            ])->json();

            $count = 0;

            foreach ($getCourses as $course) {
                $courseName = $course['fullname'];
                $getTasks = Http::get($url . '/webservice/rest/server.php', [
                    'wstoken' => $platform->token,
                    'wsfunction' => 'core_calendar_get_calendar_events',
                    'moodlewsrestformat' => 'json',
                    'events[courseids][0]' => $course['id']
                ])->json();

                if (!isset($getTasks['events'])) continue;

                foreach ($getTasks['events'] as $task) {

                    $tsk = Task::where('title', $task['name'])->where('course', $courseName)->first();
                    if ($tsk) continue; // si ya existe la tarea

                    $taskDate = Carbon::createFromTimestamp($task['timestart'])->subHours(6);
                    $status = $taskDate->isAfter(Carbon::now()) ? 'pendiente' : 'atrasado';

                    Task::updateOrCreate(
                        [
                            'title' => $task['name'],
                            'course' => $courseName,
                        ],
                        [
                            'due_date' => $taskDate->format('Y-m-d'),
                            'status' => $status,
                        ]
                    );
                    $count++;
                }
            }

            return response()->json([
                'success' => true,
                'message' => "Refrescado con exito. Se encontraron {$count} tareas nuevas."
            ]);

        } catch (Exception $e) {
            Log::error("Error refrescando plataforma: " . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error inesperado: ' . $e->getMessage()
            ], 500);
        }
    }
}