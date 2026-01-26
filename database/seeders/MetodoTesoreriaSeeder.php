<?php

namespace Database\Seeders;

use App\Models\Contabilidad\PlanCuentas\Cuenta;
use Illuminate\Database\Seeder;
use App\Models\General\MetodoTesoreria;

class MetodoTesoreriaSeeder extends Seeder
{
    public function run(): void
    {
        $metodos = [
            ['nombre' => 'Efectivo', 'descripcion' => 'Pago en efectivo', 'habilitado' => true, 'co_cuenta_id' => Cuenta::where('codigo', '11102000001')->first()->id],
            ['nombre' => 'Transferencia', 'descripcion' => 'Transferencia bancaria', 'habilitado' => true, 'co_cuenta_id' => Cuenta::where('codigo', '11102000001')->first()->id],
            ['nombre' => 'Cheque', 'descripcion' => 'Pago con cheque', 'habilitado' => true, 'co_cuenta_id' => Cuenta::where('codigo', '11102000001')->first()->id],
            ['nombre' => 'Tarjeta', 'descripcion' => 'Pago con tarjeta de crédito/débito', 'habilitado' => true, 'co_cuenta_id' => Cuenta::where('codigo', '11102000001')->first()->id],
        ];

        foreach ($metodos as $m) {
            MetodoTesoreria::updateOrCreate(['nombre' => $m['nombre']], $m);
        }
    }
}
