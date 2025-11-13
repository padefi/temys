<?php

namespace App\Http\Controllers\Contabilidad\Asientos;

use App\Http\Controllers\Controller;
use App\Http\Resources\Contabilidad\Asientos\AsientoResource;
use App\Models\Contabilidad\Asientos\Asiento;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsientoController extends Controller
{
    public function index()
    {
        $asientos = Asiento::with(['ejercicio' => function ($query)
        {
            $query->selectRaw('id, descripcion');
        }])->get();

        return Inertia::render('Contabilidad/ApuntesContables/Asientos/page', [
            'asientos' => AsientoResource::collection($asientos)
        ]);
    }
}
