<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('relacion_comprobante_orden_tesoreria', function (Blueprint $table) {
            $table->id();

            // 🔹 Primero se definen las columnas
            $table->unsignedBigInteger('comprobante_id');
            $table->unsignedBigInteger('orden_tesoreria_id');

            // 🔹 Luego las claves foráneas
            $table->foreign('comprobante_id', 'fk_rel_comprobante')
                  ->references('id')->on('comprobantes')
                  ->onDelete('cascade');

            $table->foreign('orden_tesoreria_id', 'fk_rel_orden_tesoreria')
                  ->references('id')->on('orden_tesoreria')
                  ->onDelete('cascade');

            // 🔹 Otros campos
            $table->decimal('importe_aplicado', 12, 2);
            $table->date('fecha_aplicacion')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_orden_tesoreria');
    }
};
