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
        Schema::create('motivos_reembolso', function (Blueprint $table) {
            $table->id();
            $table->string('codigo', 30)->unique(); // ej: ERROR_IMPORTE
            $table->string('descripcion');
            $table->string('categoria')->nullable(); // error, devolucion, ajuste, etc.
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('motivos_reembolso');
    }
};
