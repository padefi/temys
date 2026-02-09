<?php

namespace Database\Seeders;

use App\Models\Contabilidad\MotivoReembolso;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MotivoReembolsoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $motivos = [

            // 🧾 Errores de facturación
            ['codigo' => 'ERROR_IMPORTE', 'descripcion' => 'Error en el importe facturado', 'categoria' => 'error'],
            ['codigo' => 'ERROR_CONCEPTO', 'descripcion' => 'Error en el concepto o descripción', 'categoria' => 'error'],
            ['codigo' => 'ERROR_IVA', 'descripcion' => 'Error en la alícuota de IVA', 'categoria' => 'error'],
            ['codigo' => 'ERROR_CLIENTE', 'descripcion' => 'Error en los datos del cliente', 'categoria' => 'error'],
            ['codigo' => 'ERROR_COMPROBANTE', 'descripcion' => 'Tipo de comprobante incorrecto', 'categoria' => 'error'],

            // 🔁 Devoluciones
            ['codigo' => 'DEVOLUCION_TOTAL', 'descripcion' => 'Devolución total de mercadería', 'categoria' => 'devolucion'],
            ['codigo' => 'DEVOLUCION_PARCIAL', 'descripcion' => 'Devolución parcial de mercadería', 'categoria' => 'devolucion'],
            ['codigo' => 'ANULACION_OPERACION', 'descripcion' => 'Anulación de la operación', 'categoria' => 'devolucion'],

            // 💰 Ajustes comerciales
            ['codigo' => 'DESCUENTO_POSTERIOR', 'descripcion' => 'Descuento posterior a la facturación', 'categoria' => 'ajuste'],
            ['codigo' => 'BONIFICACION', 'descripcion' => 'Bonificación comercial', 'categoria' => 'ajuste'],
            ['codigo' => 'AJUSTE_PRECIO', 'descripcion' => 'Ajuste de precio acordado', 'categoria' => 'ajuste'],

            // 📉 Ajustes financieros
            ['codigo' => 'INTERES_INCORRECTO', 'descripcion' => 'Intereses mal calculados', 'categoria' => 'financiero'],
            ['codigo' => 'DIF_CAMBIO', 'descripcion' => 'Ajuste por diferencia de cambio', 'categoria' => 'financiero'],
            ['codigo' => 'REDONDEO', 'descripcion' => 'Ajuste por redondeo', 'categoria' => 'financiero'],

            // ❌ Pagos / pagos
            ['codigo' => 'PAGO_DUPLICADO', 'descripcion' => 'Pago duplicado', 'categoria' => 'administrativo'],
            ['codigo' => 'PAGO_INDEBIDO', 'descripcion' => 'Pago indebido', 'categoria' => 'administrativo'],
            ['codigo' => 'ANTICIPO_MAL_APLICADO', 'descripcion' => 'Anticipo mal aplicado', 'categoria' => 'administrativo'],

        ];

        foreach ($motivos as $motivo) {
            MotivoReembolso::updateOrCreate(
                ['codigo' => $motivo['codigo']],
                $motivo
            );
        }
    }
}
