<?php

namespace App\Http\Controllers\Contabilidad\Asientos;

use App\Http\Controllers\Controller;
use App\Http\Requests\Contabilidad\AsientoRequest;
use App\Http\Resources\Contabilidad\Asientos\AsientoResource;
use App\Models\Contabilidad\Asientos\Asiento;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

    public function store(AsientoRequest $request)
    {
        $validated = $request->validated();

        try
        {
            $asiento = DB::transaction(function () use ($validated)
            {
                $ultimoNumero = Asiento::where('co_ejercicio_id', $validated['ejercicio'])
                    ->lockForUpdate() // Se bloquea la fila para evitar que dos usuarios tomen el mismo número
                    ->max('numero');

                $nuevoNumero = $ultimoNumero ? ($ultimoNumero + 1) : 1;

                $asiento = Asiento::create([
                    'numero'           => $nuevoNumero,
                    'co_ejercicio_id'  => $validated['ejercicio'],
                    'fecha'            => $validated['fecha'],
                    'concepto'         => $validated['concepto'],
                    'importe'          => $validated['importe'],
                    'estado'           => $validated['estado'],
                    'model_id_created' => Auth::id(),
                ]);

                if ($validated['estado'] === 'CONTROLADO')
                {
                    $asiento->update([
                        'model_id_confirmed' => Auth::id(),
                        'confirmed_at'       => now(),
                    ]);
                }

                foreach ($validated['partidas'] as $index => $item)
                {
                    $asiento->partidas()->create([
                        'co_cuenta_id' => $item['cuenta']['id'],
                        'debe'         => $item['debe'],
                        'haber'        => $item['haber'],
                        'concepto'     => $item['concepto'] ?? $asiento->concepto,
                        'orden'        => $index,
                    ]);
                }

                $totalDebe = collect($validated['partidas'])->sum('debe');
                $totalHaber = collect($validated['partidas'])->sum('haber');

                if (abs($totalDebe - $totalHaber) > 0.01)
                {
                    throw new \Exception("El asiento no balancea. Diferencia: " . abs($totalDebe - $totalHaber));
                }

                return $asiento;
            });

            return response()->json([
                'message' => "Asiento Nº {$asiento->numero} creado con éxito",
                'asiento' => $asiento->load('partidas.cuenta')
            ], 201);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Error al crear el asiento: ' . $e->getMessage()
            ], 422);
        }
    }

    public function update(AsientoRequest $request, Asiento $asiento)
    {
        if (!$asiento->isEditable())
        {
            return response()->json([
                'message' => "No se puede editar un asiento en estado {$asiento->estado}."
            ], 422);
        }

        $validated = $request->validated();

        try
        {
            DB::transaction(function () use ($asiento, $validated)
            {
                $datosAsiento = [
                    'numero'          => $validated['numero'],
                    'co_ejercicio_id' => $validated['ejercicio'],
                    'fecha'           => $validated['fecha'],
                    'concepto'        => $validated['concepto'],
                    'importe'         => $validated['importe'],
                    'estado'          => $validated['estado'],
                    'model_id_updated' => Auth::id(),
                ];

                if ($validated['estado'] === 'CONTROLADO' && $asiento->estado !== 'CONTROLADO')
                {
                    $datosAsiento['model_id_confirmed'] = Auth::id();
                    $datosAsiento['confirmed_at'] = now();
                }

                if ($validated['estado'] === 'ANULADO' && $asiento->estado !== 'ANULADO')
                {
                    $datosAsiento['model_id_voided'] = Auth::id();
                    $datosAsiento['voided_at'] = now();
                }

                $asiento->update($datosAsiento);
                $asiento->partidas()->delete();

                foreach ($validated['partidas'] as $index => $item)
                {
                    $asiento->partidas()->create([
                        'co_cuenta_id' => $item['cuenta']['id'],
                        'debe'         => $item['debe'],
                        'haber'        => $item['haber'],
                        'concepto'     => $item['concepto'] ?? $asiento->concepto,
                        'orden'        => $index,
                    ]);
                }

                $totalDebe = collect($validated['partidas'])->sum('debe');
                $totalHaber = collect($validated['partidas'])->sum('haber');

                if (abs($totalDebe - $totalHaber) > 0.01)
                {
                    throw new \Exception("El asiento contable no balancea (Debe: $totalDebe, Haber: $totalHaber).");
                }
            });

            return response()->json([
                'message' => 'Asiento actualizado con éxito',
                'asiento' => $asiento->load('partidas.cuenta')
            ], 200);
        }
        catch (\Exception $e)
        {
            return response()->json([
                'message' => 'Error al procesar el asiento: ' . $e->getMessage()
            ], 422);
        }
    }
}
