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
        Schema::create('relacion_movimiento_ajuste', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movimiento_stock_id');
            $table->unsignedBigInteger('ajuste_detalle_id');


            //relaciones
            $table->foreign('movimiento_stock_id')->references('id')->on('inventario_movimiento_stocks');
            $table->foreign('ajuste_detalle_id')->references('id')->on('inventario_ajuste');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_movimiento_ajuste');
    }
};
