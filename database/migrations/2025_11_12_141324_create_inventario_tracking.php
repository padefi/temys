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
        Schema::create('inventario_tracking', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('entrega_id'); 
  
            // Info del tracking
            $table->enum('estado', ['pendiente', 'en_transito', 'en_ruta', 'completado', 'entregado', 'cancelado', 'retenido']);
            $table->date('fecha_salida')->nullable();
            $table->date('fecha_llegada')->nullable();
            $table->text('observaciones')->nullable();

            // Relaciones
            $table->foreign('entrega_id')->references('id')->on('inventario_orden_entregas')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_tracking');
    }
};
