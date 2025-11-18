<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('relacion_comprobante_orden_pago_proveedores', function (Blueprint $table) {
            $table->id();

            // 🔹 Primero se definen las columnas
            $table->unsignedBigInteger('comprobante_id');
            $table->unsignedBigInteger('orden_pago_id');

            // 🔹 Luego las claves foráneas
            $table->foreign('comprobante_id', 'fk_rel_comprobante')
                  ->references('id')->on('comprobantes_proveedores')
                  ->onDelete('cascade');

            $table->foreign('orden_pago_id', 'fk_rel_orden_pago')
                  ->references('id')->on('orden_pago_proveedores')
                  ->onDelete('cascade');

            // 🔹 Otros campos
            $table->decimal('importe_aplicado', 12, 2);
            $table->date('fecha_aplicacion')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_orden_pago_proveedores');
    }
};
