<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\CondicionVenta;

class CondicionVentaSeeder extends Seeder
{
    public function run(): void
    {
        $condiciones = [
            ['nombre' => 'Contado', 'descripcion' => 'Pago inmediato al momento de la compra.'],
            ['nombre' => 'Financiado', 'descripcion' => 'Pago en cuotas o con financiación.'],
            ['nombre' => 'Cheque', 'descripcion' => 'Pago mediante cheque diferido o al día.'],
            ['nombre' => 'Tarjeta', 'descripcion' => 'Pago con tarjeta de crédito o débito.'],
            ['nombre' => 'Transferencia', 'descripcion' => 'Pago mediante transferencia bancaria.'],
        ];

        foreach ($condiciones as $condicion) {
            CondicionVenta::create($condicion);
        }
    }
}
