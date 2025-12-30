<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orden_venta_detalle_impuestos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_ventas_detalles_id');
            $table->unsignedBigInteger('impuesto_id');
            $table->timestamps();

            // 🔹 Nombres de constraints personalizados (más cortos)
            $table->foreign('orden_ventas_detalles_id', 'ovd_impuesto_ovd_fk')
                ->references('id')
                ->on('orden_ventas_detalles')
                ->onDelete('cascade');

            $table->foreign('impuesto_id', 'ovd_impuesto_imp_fk')
                ->references('id')
                ->on('impuestos')
                ->onDelete('cascade');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_venta_detalle_impuestos');
    }
};
