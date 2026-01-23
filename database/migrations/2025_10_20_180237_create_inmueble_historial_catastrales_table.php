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
        Schema::create('inmueble_historial_catastrales', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('id_escritura');              
          /*   $table->unsignedBigInteger('tipo_catastro'); */
            $table->string('circunscripcion')->nullable();
            $table->string('manzana')->nullable();
            $table->string('parcela')->nullable();
            $table->string('poligono')->nullable();
            $table->string('zona')->nullable();
            $table->string('partida')->nullable();
            $table->string('valuacion_fiscal')->nullable();
      
            //Relaciones
            $table->foreign('id_escritura')->references('id')->on('inmuebles_escritura');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inmueble_historial_catastrales');
    }
};
