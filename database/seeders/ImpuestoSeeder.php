<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\Impuesto;
use App\Models\Contabilidad\PlanCuentas\Cuenta;

class ImpuestoSeeder extends Seeder
{
    public function run(): void
    {
        $impuestos = [
            // IVA
            [
                'descripcion' => 'IVA 21%',
                'porcentaje' => 21,
                'cuenta_codigo' => '2.1.1.01',
            ],
            [
                'descripcion' => 'IVA 10,5%',
                'porcentaje' => 10.5,
                'cuenta_codigo' => '2.1.1.02',
            ],
            [
                'descripcion' => 'IVA 27%',
                'porcentaje' => 27,
                'cuenta_codigo' => '2.1.1.03',
            ],
            [
                'descripcion' => 'IVA Exento',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.1.04',
            ],
            [
                'descripcion' => 'IVA No Gravado',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.1.05',
            ],

            // Percepciones / Retenciones IVA
            [
                'descripcion' => 'Percepción IVA',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.2.01',
            ],
            [
                'descripcion' => 'Retención IVA',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.2.02',
            ],

            // Ingresos Brutos
            [
                'descripcion' => 'Percepción Ingresos Brutos',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.3.01',
            ],
            [
                'descripcion' => 'Retención Ingresos Brutos',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.3.02',
            ],

            // Otros impuestos nacionales
            [
                'descripcion' => 'Impuestos Internos',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.4.01',
            ],
            [
                'descripcion' => 'Retención Ganancias',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.5.01',
            ],
            [
                'descripcion' => 'Impuesto de Sell_attachmentos',
                'porcentaje' => 0,
                'cuenta_codigo' => '2.1.6.01',
            ],
        ];

        foreach ($impuestos as $data) {

            $cuenta = Cuenta::where('codigo', $data['cuenta_codigo'])->first();

            if (!$cuenta) {
                $this->command->warn(
                    "Cuenta contable {$data['cuenta_codigo']} no encontrada. Impuesto '{$data['descripcion']}' no insertado."
                );
                continue;
            }

            Impuesto::updateOrCreate(
                ['descripcion' => $data['descripcion']],
                [
                    'porcentaje'   => $data['porcentaje'],
                    'co_cuenta_id' => $cuenta->id,
                    'habilitado'   => true,
                ]
            );
        }
    }
}
