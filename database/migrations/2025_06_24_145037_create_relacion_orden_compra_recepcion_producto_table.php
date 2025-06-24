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
        Schema::create('relacion_orden_compra_recepcion_producto', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_compra_id');
            $table->unsignedBigInteger('recepcion_productos_id');


            //relaciones
            $table->foreign('orden_compra_id')->references('id')->on('ordenes_compra');
            $table->foreign('recepcion_productos_id')->references('id')->on('inventario_recepcion_productos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_orden_compra_recepcion_producto');
    }
};
