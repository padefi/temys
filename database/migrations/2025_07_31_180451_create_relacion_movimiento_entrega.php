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
   
        Schema::create('relacion_movimiento_entrega', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('movimiento_stock_id');
            $table->unsignedBigInteger('orden_detalle_id');


            //relaciones
            $table->foreign('movimiento_stock_id')->references('id')->on('inventario_movimiento_stocks');
            $table->foreign('orden_detalle_id')->references('id')->on('inventario_orden_entrega_detalles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_movimiento_entrega');
    }
};
