<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_comprobantes_proveedores_plan_pagos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comprobante_proveedor_id');
            $table->unsignedBigInteger('plan_pagos_id');

            // Nombres más cortos para las FKs
            $table->foreign('comprobante_proveedor_id', 'fk_rcp_comprobante')
                  ->references('id')->on('comprobantes_proveedores')
                  ->onDelete('cascade');

            $table->foreign('plan_pagos_id', 'fk_rcp_planpago')
                  ->references('id')->on('plan_pagos')
                  ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobantes_proveedores_plan_pagos');
    }
};
