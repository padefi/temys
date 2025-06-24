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
        Schema::create('relacion_movimiento_stock_recepcion_detalle', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movimiento_stock_id');
            $table->unsignedBigInteger('recepcion_productos_detalle_id');


            //relaciones
            $table->foreign('movimiento_stock_id')->references('id')->on('inventario_movimientos_stock');
            $table->foreign('recepcion_productos_detalle_id')->references('id')->on('inventario_recepcion_productos_detalle');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_movimiento_stock_recepcion_detalle');
    }
};
