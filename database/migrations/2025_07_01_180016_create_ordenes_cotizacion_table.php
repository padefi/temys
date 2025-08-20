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
        Schema::create('orden_cotizaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('proveedor_id');
            $table->unsignedBigInteger('moneda_id');
            $table->date('cotizar_antes_de');
            $table->date('entrega_esperada');
            $table->string('entregar_a');
            $table->string('observaciones');
            $table->unsignedBigInteger('almacen_destino_id')->nullable();
            $table->enum('estado', ['Pendiente', 'Confirmada', 'Cancelada']);
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            $table->timestamps();

            $table->foreign('proveedor_id')->references('id')->on('proveedores');
            $table->foreign('moneda_id')->references('id')->on('tipo_monedas');
            $table->foreign('almacen_destino_id')->references('id')->on('almacenes');
            $table->foreign('usuario_id')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

        }); // Close Schema::create() call
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_cotizacion');
    }

};
