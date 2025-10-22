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
        Schema::create('inventario_orden_entrega_canceladas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_entrega_id');
            $table->text('motivo');
            $table->timestamp('fecha');
            $table->unsignedBigInteger('usuario');
      
            //Relaciones

            $table->foreign('orden_entrega_id')->references('id')->on('inventario_orden_entregas');
            $table->foreign('usuario')->references('id')->on('users');
   
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_orden_entrega_canceladas');
    }
};
