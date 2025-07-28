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
        Schema::create('tipo_monedas', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 10)->unique(); // Ej: USD, ARS
            $table->string('descripcion'); // Ej: Dólar estadounidense
            $table->string('simbolo', 5); // Ej: $, €
            $table->string('pais_origen'); // Ej: Estados Unidos
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipo_monedas');
    }
};
