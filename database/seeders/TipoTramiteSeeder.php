<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\General\TipoTramite;
use App\Models\Compras\PlanPago;
use App\Models\Compras\OrdenPago;

class TramitesPagoSeeder extends Seeder
{
    public function run(): void
    {
        // Crear tipos de trámite
        $tramites = TipoTramite::factory()->count(4)->create();

        // Crear planes de pago
        $planes = PlanPago::factory()->count(5)->create();

        // Relacionar tipo_tramite con plan_pago
        foreach ($tramites as $tramite) {
            $tramite->planesPago()->attach(
                $planes->random(rand(1, 3))->pluck('id')->toArray()
            );
        }

        // Crear órdenes de pago
        OrdenPago::factory()->count(10)->create();
    }
}
