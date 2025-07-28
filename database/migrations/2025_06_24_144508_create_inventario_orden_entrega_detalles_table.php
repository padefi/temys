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
        Schema::create('inventario_orden_entrega_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_entrega_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad_enviada');
      
            
     
             //Relaciones

            $table->foreign('orden_entrega_id')->references('id')->on('inventario_orden_entregas');
            $table->foreign('producto_id')->references('id')->on('productos');
   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_orden_entrega_detalles');
    }
};
