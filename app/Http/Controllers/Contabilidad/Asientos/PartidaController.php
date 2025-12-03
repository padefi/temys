<?php

namespace App\Http\Controllers\Contabilidad\Asientos;

use App\Http\Controllers\Controller;
use App\Http\Resources\Contabilidad\Asientos\PartidaResource;
use App\Models\Contabilidad\Asientos\Asiento;
use App\Models\Contabilidad\Asientos\Partida;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PartidaController extends Controller
{
    public function show(Asiento $asiento)
    {
        $partidas = Partida::byAsientoId($asiento->id)
            ->with(['cuenta' => function ($query)
            {
                $query->select('id', 'codigo', 'descripcion', 'estado');
            }])->get();

        return Inertia::render('Contabilidad/ApuntesContables/Partidas/page', [
            'partidas' => PartidaResource::collection($partidas),
            'fecha' => $asiento->fecha,
            'numero' => $asiento->numero,
        ]);
    }
}
