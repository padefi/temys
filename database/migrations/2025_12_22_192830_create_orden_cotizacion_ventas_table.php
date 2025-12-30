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
        Schema::create('orden_cotizaciones_ventas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cliente_id');
            $table->unsignedBigInteger('moneda_id');
            $table->date('cotizar_antes_de');
            $table->date('entrega_esperada');
            $table->string('observaciones');
            $table->unsignedBigInteger('almacen_destino_id')->nullable();
            $table->enum('estado', ['Pendiente', 'Confirmada', 'Cancelada']);
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            $table->timestamps();

            $table->foreign('cliente_id')->references('id')->on('clientes');
            $table->foreign('moneda_id')->references('id')->on('tipo_monedas');
            $table->foreign('almacen_destino_id')->references('id')->on('almacenes');
            $table->foreign('usuario_id')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_cotizaciones_ventas');
    }
};
