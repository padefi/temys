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
        Schema::create('inventario_ajuste_detalles', function (Blueprint $table) {
            $table->id();           
            $table->unsignedBigInteger('ajuste_inventario_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad_sistema');
            $table->integer('cantidad_contada');    
            $table->foreign('ajuste_inventario_id')->references('id')->on('inventario_ajuste');
            $table->foreign('producto_id')->references('id')->on('productos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_ajuste_detalles');
    }
};
