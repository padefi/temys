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
        Schema::create('relacion_almacen_inmueble', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('inmuebles_id');
            $table->unsignedBigInteger('almacenes_id');


            //relaciones
            $table->foreign('inmuebles_id')->references('id')->on('inmuebles');
            $table->foreign('almacenes_id')->references('id')->on('almacenes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_almacen_inmueble');
    }
};
