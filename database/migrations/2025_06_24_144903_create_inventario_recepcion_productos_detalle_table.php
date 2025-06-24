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
        Schema::create('inventario_recepcion_productos_detalle', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('recepcion_producto_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad_recibida');
            $table->integer('cantidad_esperada');
            $table->enum('estado', ['completo','Parcial','faltante']);
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();


            //Relaciones
            $table->foreign('recepcion_producto_id')->references('id')->on('inventario_recepcion_productos');
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_recepcion_productos_detalle');
    }
};
