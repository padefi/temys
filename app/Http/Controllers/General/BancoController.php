<?php

namespace App\Http\Controllers\General;
use App\Http\Controllers\Controller;
use App\Models\General\Banco;
use App\Models\General\Cheque;
use App\Models\General\CuentaBancaria;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\JsonResponse;

class BancoController extends Controller
{
    ////LISTAR BANCOS
    public function index()
    {
            return Banco::with(['cuentaBancaria' => function ($query) {
                $query->where('activo', true);
            }])->get();
    }

    // OBTENER PROXIMO CHEQUE
    public function proximoCheque(int $cuentaBancariaId): JsonResponse
    {
        // (opcional pero recomendado) validar que exista la cuenta
        CuentaBancaria::findOrFail($cuentaBancariaId);

        // último número de cheque usado en esa cuenta
        $ultimoNumero = Cheque::where('cuenta_bancaria_id', $cuentaBancariaId)
            ->max('numero');

        return response()->json([
            'numero' => ($ultimoNumero ?? 0) + 1
        ]);
    }


}
