<?php

namespace Database\Seeders;

use App\Models\Contabilidad\PlanCuentas\Ejercicio;
use App\Models\Contabilidad\PlanCuentas\Capitulo;
use App\Models\Contabilidad\PlanCuentas\Subcapitulo;
use App\Models\Contabilidad\PlanCuentas\Rubro;
use App\Models\Contabilidad\PlanCuentas\Subrubro;
use Illuminate\Database\Seeder;

class PlanCuentasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $ejercicio = Ejercicio::create([
            'descripcion' => '2025',
            'fecha_inicio' => '2025-01-01',
            'fecha_fin' => '2025-12-31',
            'estado' => 'ABIERTO',
            'model_id_created' => 1,
            'created_at' => now(),
        ]);

        $capitulosFile = storage_path('app/csv/ChartAccounts/capitulos.csv');
        $subcapitulosFile = storage_path('app/csv/ChartAccounts/subcapitulos.csv');
        $rubrosFile = storage_path('app/csv/ChartAccounts/rubros.csv');
        $subrubrosFile = storage_path('app/csv/ChartAccounts/subrubros.csv');
        $cuentasFile = storage_path('app/csv/ChartAccounts/cuentas.csv');
        // Rubros
        $capitulos = array_map(fn($line) => str_getcsv($line, ';'), file($capitulosFile));
        $subcapitulos = array_map(fn($line) => str_getcsv($line, ';'), file($subcapitulosFile));
        $rubros = array_map(fn($line) => str_getcsv($line, ';'), file($rubrosFile));
        $subrubros = array_map(fn($line) => str_getcsv($line, ';'), file($subrubrosFile));
        $cuentas = array_map(fn($line) => str_getcsv($line, ';'), file($cuentasFile));

        // Se ordenar los arrays por codigo
        foreach ([$capitulos, $subcapitulos, $rubros, $subrubros, $cuentas] as &$arr)
        {
            usort($arr, function ($a, $b)
            {
                $codigoA = (int) trim($a[0], '"');
                $codigoB = (int) trim($b[0], '"');
                return $codigoA <=> $codigoB;
            });
        }

        // Se ordenar los arrays por codigo
        foreach ([$capitulos, $subcapitulos, $rubros, $subrubros, $cuentas] as &$arr)
        {
            usort($arr, function ($a, $b)
            {
                $codigoA = (int) trim($a[0], '"');
                $codigoB = (int) trim($b[0], '"');
                return $codigoA <=> $codigoB;
            });
        }

        $capituloMap = [];
        foreach ($capitulos as $capituloData)
        {
            $codigo = trim($capituloData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($capituloData[1], '"'));

            $capitulo = $ejercicio->capitulos()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'co_ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $capituloMap[$codigo] = $capitulo->id;
        }

        $subcapituloMap = [];
        foreach ($subcapitulos as $subcapituloData)
        {
            $codigo = trim($subcapituloData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($subcapituloData[1], '"'));
            $capituloCodigo = substr($codigo, 0, 1);
            $capitulo = isset($capituloMap[$capituloCodigo]) ? Capitulo::find($capituloMap[$capituloCodigo]) : null;

            if (!$capitulo)
            {
                continue;
            }

            $subcapitulo = $capitulo->subcapitulos()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'co_capitulo_id' => $capituloMap[$capituloCodigo] ?? null,
                'co_ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $subcapituloMap[$codigo] = $subcapitulo->id;
        }

        $rubroMap = [];
        foreach ($rubros as $rubroData)
        {
            $codigo = trim($rubroData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($rubroData[1], '"'));
            $subcapituloCodigo = substr($codigo, 0, 2);
            $subcapitulo = isset($subcapituloMap[$subcapituloCodigo]) ? Subcapitulo::find($subcapituloMap[$subcapituloCodigo]) : null;

            if (!$subcapitulo)
            {
                continue;
            }

            $rubro = $subcapitulo->rubros()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'co_subcapitulo_id' => $subcapituloMap[$subcapituloCodigo] ?? null,
                'co_ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $rubroMap[$codigo] = $rubro->id;
        }

        $subrubroMap = [];
        foreach ($subrubros as $subrubroData)
        {
            $codigo = trim($subrubroData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($subrubroData[1], '"'));
            $rubroCodigo = substr($codigo, 0, 3);
            $rubro = isset($rubroMap[$rubroCodigo]) ? Rubro::find($rubroMap[$rubroCodigo]) : null;

            if (!$rubro)
            {
                continue;
            }

            $subrubro = $rubro->subrubros()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'co_rubro_id' => $rubroMap[$rubroCodigo] ?? null,
                'co_ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $subrubroMap[$codigo] = $subrubro->id;
        }

        foreach ($cuentas as $cuentaData)
        {
            $codigo = trim($cuentaData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($cuentaData[1], '"'));
            $subrubroCodigo = substr($codigo, 0, 5);
            $subrubro = isset($subrubroMap[$subrubroCodigo]) ? Subrubro::find($subrubroMap[$subrubroCodigo]) : null;

            if (!$subrubro)
            {
                continue;
            }

            $cuenta = $subrubro->cuentas()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'co_subrubro_id' => $subrubroMap[$subrubroCodigo] ?? null,
                'co_ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $cuenta->saldo()->create([
                'co_cuenta_id' => $cuenta->id,
                'co_ejercicio_id' => $ejercicio->id,
                'debe' => 0,
                'haber' => 0,
                'saldo' => 0,
            ]);
        }

        /* $rubroMap = [];
        foreach ($rubros as $rubroData)
        {
            $codigo = trim($rubroData[0], '"');
            $descripcion = trim($rubroData[1], '"');
            $padreCodigo = strlen($codigo) > 1 ? substr($codigo, 0, strlen($codigo) - 1) : null;

            $rubro = $ejercicio->rubros()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'rubro_padre_id' => $padreCodigo ? ($rubroMap[$padreCodigo] ?? null) : null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $rubroMap[$codigo] = $rubro->id;
        }

        // Cuentas
        $cuentaMap = [];
        foreach ($cuentas as $cuentaData)
        {
            $codigo = trim($cuentaData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($cuentaData[1], '"'));
            $rubroCodigo = substr($codigo, 0, 3);
            $rubro = isset($rubroMap[$rubroCodigo]) ? Rubro::find($rubroMap[$rubroCodigo]) : null;

            if (!$rubro)
            {
                continue;
            }

            $cuenta = $rubro->cuentas()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'rubro_id' => $rubroMap[$rubroCodigo] ?? null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);

            $cuentaMap[$codigo] = $cuenta->id;
        }

        // Subcuentas
        foreach ($subcuentas as $subData)
        {
            $codigo = trim($subData[0], '"');
            $descripcion =  preg_replace('/[^\x20-\x7E]/', '', trim($subData[1], '"'));
            $cuentaCodigo = substr($codigo, 0, 5);
            $cuenta = isset($cuentaMap[$cuentaCodigo]) ? Cuenta::find($cuentaMap[$cuentaCodigo]) : null;

            if (!$cuenta)
            {
                continue;
            }

            $cuenta->subcuentas()->create([
                'codigo' => $codigo,
                'descripcion' => $descripcion,
                'cuenta_id' => $cuentaMap[$cuentaCodigo] ?? null,
                'ejercicio_id' => $ejercicio->id,
                'model_id_created' => 1,
                'created_at' => now(),
            ]);
        } */
    }
}
