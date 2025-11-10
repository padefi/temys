<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\MetodoPago;

class MetodoPagoSeeder extends Seeder
{
    public function run(): void
    {
        $metodos = [
            ['nombre' => 'Efectivo', 'descripcion' => 'Pago en efectivo', 'habilitado' => true],
            ['nombre' => 'Transferencia', 'descripcion' => 'Transferencia bancaria', 'habilitado' => true],
            ['nombre' => 'Cheque', 'descripcion' => 'Pago con cheque', 'habilitado' => true],
            ['nombre' => 'Tarjeta', 'descripcion' => 'Pago con tarjeta de crédito/débito', 'habilitado' => true],
        ];

        foreach ($metodos as $m) {
            MetodoPago::updateOrCreate(['nombre' => $m['nombre']], $m);
        }
    }
}
