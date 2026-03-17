<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('padron', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo_documento', ['DNI', 'Pasaporte', 'Cédula', 'LC', 'LE', 'CUIT', 'CUIL']);
            $table->string('documento', 20);
            $table->unsignedBigInteger('nacionalidad')->nullable();
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            //Relaciones
            $table->foreign('nacionalidad')->references('id')->on('nacionalidades');
            $table->foreign('usuario_creacion')->references('id')->on('users');    
            $table->foreign('usuario_actualizacion')->references('id')->on('users');      
        });
    }

    public function down()
    {
        Schema::dropIfExists('padron');
    }
};