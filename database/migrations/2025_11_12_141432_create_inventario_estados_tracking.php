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
        Schema::create('inventario_estados_tracking', function (Blueprint $table) {
         $table->id();
        $table->unsignedBigInteger('seguimiento_id'); 
        $table->enum('estado', ['pendiente', 'en_transito', 'en_ruta', 'completado', 'entregado', 'cancelado', 'retenido']);
        $table->unsignedBigInteger('usuario_id')->nullable();
        $table->string('ubicacion_actual')->nullable(); 
        $table->timestamp('fecha');
        $table->text('observacion')->nullable(); 
        
        // Relaciones
        $table->foreign('seguimiento_id')->references('id')->on('inventario_tracking')->onDelete('cascade');
        $table->foreign('usuario_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_estados_tracking');
    }
};
