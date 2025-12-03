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
        Schema::create('cuenta_bancarias', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banco_id')         // Relación con bancos
                  ->constrained('bancos')        // Hace la FK a la tabla bancos
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
            $table->foreignId('co_cuenta_id')         // Relación con bancos
                  ->constrained('co_cuentas')        // Hace la FK a la tabla bancos
                  ->cascadeOnUpdate()
                  ->cascadeOnDelete();
            $table->string('numero_cuenta');      // Número de cuenta
            $table->boolean('activo')->default(true);  // Activo o inactivo
            $table->string('tipo_cuenta');        // Tipo de cuenta (caja de ahorro pesos, dólares, etc)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cuenta_bancarias');
    }
};
