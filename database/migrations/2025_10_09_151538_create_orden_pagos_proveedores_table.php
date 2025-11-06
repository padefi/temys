<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orden_pago_proveedores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('plan_pago_id')->constrained('plan_pagos')->onDelete('cascade');
            $table->foreignId('moneda_id')->constrained('tipo_monedas')->onDelete('cascade');
            $table->foreignId('metodo_pago_id')->constrained('metodo_pagos')->onDelete('cascade');
            $table->decimal('importe', 15, 2);
            $table->date('fecha_pago');
            $table->foreignId('banco_origen_id')->nullable()->constrained('bancos')->onDelete('cascade');
            $table->foreignId('cuenta_origen_id')->nullable()->constrained('cuenta_bancarias')->onDelete('cascade');
            $table->foreignId('tarjeta_origen_id')->nullable()->constrained('tarjetas')->onDelete('cascade');
            $table->string('cbu_pago')->nullable();
            $table->enum('estado', ['Pendiente', 'Confirmado'])->default('Pendiente');
            $table->unsignedBigInteger('usuario_creacion');
            $table->unsignedBigInteger('usuario_pago')->nullable();
            $table->timestamps();

            // Relaciones de usuarios
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_pago')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orden_pago_proveedores');
    }
};
