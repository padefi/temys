<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('metodo_pagos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('descripcion')->nullable();
            $table->boolean('habilitado')->default(true);
            $table->foreignId('co_cuenta_id')->nullable()         // Relación con bancos
                  ->constrained('co_cuentas')        // Hace la FK a la tabla bancos
                  ->cascadeOnUpdate();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('metodo_pagos');
    }
};
