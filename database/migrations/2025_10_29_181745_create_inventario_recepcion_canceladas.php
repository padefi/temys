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
        Schema::create('inventario_recepcion_canceladas', function (Blueprint $table) {
           $table->id();
            $table->unsignedBigInteger('recepcion_id');
            $table->text('motivo');
            $table->timestamp('fecha');
            $table->unsignedBigInteger('usuario');
      
            //Relaciones

            $table->foreign('recepcion_id')->references('id')->on('inventario_recepcion_productos');
            $table->foreign('usuario')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_recepcion_canceladas');
    }
};
