<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('relacion_comprobante_partida', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('comprobante_id');
            $table->unsignedBigInteger('partida_id');

            // Campos opcionales
            $table->decimal('importe_aplicado', 15, 2)->nullable();
            $table->date('fecha_aplicacion')->nullable();

            $table->timestamps();

            $table->foreign('comprobante_id')
                ->references('id')
                ->on('comprobantes_proveedores')
                ->cascadeOnDelete();

            $table->foreign('partida_id')
                ->references('id')
                ->on('co_partidas')
                ->cascadeOnDelete();

            $table->unique(['comprobante_id', 'partida_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('relacion_comprobante_partida');
    }
};
