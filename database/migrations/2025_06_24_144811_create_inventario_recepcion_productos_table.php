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
        Schema::create('inventario_recepcion_productos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('origen_id');
            $table->unsignedBigInteger('destino_id');
            $table->enum('tipo_movimiento', ['Orden de compra', 'Remito','restribuccion']);
            $table->unsignedBigInteger('movimiento_id');
            $table->date('fecha_recepcion');
            $table->enum('estado', ['Completa','Parcial','Pendiente']);
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();


            //Relaciones
            $table->foreign('origen_id')->references('id')->on('almacens');
            $table->foreign('destino_id')->references('id')->on('almacens');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_recepcion_productos');
    }
};
