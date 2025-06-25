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
        Schema::create('almacenes_domicilio', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calle_id');
            $table->integer('altura');
            $table->string('codigo_postal');
            $table->string('observacion');
            $table->integer('piso');
            $table->string('departamento');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();


            //Relaciones
            $table->foreign('inmueble_id')->references('id')->on('inmuebles');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('almacenes_domicilio');
    }
};
