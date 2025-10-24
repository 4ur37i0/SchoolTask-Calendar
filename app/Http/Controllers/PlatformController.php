<?php

namespace App\Http\Controllers;

use App\Models\Platform;
use Illuminate\Http\Request;

class PlatformController extends Controller
{
    public function index()
    {
        return response()->json(Platform::all());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'url' => 'required|url',
        ]);

        $platform = Platform::create($data);

        return response()->json(['message' => 'Plataforma creada correctamente', 'platform' => $platform]);
    }

    public function getLocalPlatforms(){
        return response()->json(Platform::all());
    }
}