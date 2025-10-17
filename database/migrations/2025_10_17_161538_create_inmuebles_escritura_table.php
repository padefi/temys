<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inmuebles_escritura', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('inmuebles_id');

            $table->bigInteger('nro_escritura')->nullable();
            $table->date('fecha_escritura')->nullable();
            $table->date('fecha_inscripcion')->nullable();
            $table->integer('folio')->nullable();
            $table->integer('tomo')->nullable();
            $table->string('observacion')->nullable();

            // Auditoría
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            
            //Relaciones
            $table->foreign('inmuebles_id')->references('id')->on('inmuebles');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inmuebles_escritura');
    }
};
