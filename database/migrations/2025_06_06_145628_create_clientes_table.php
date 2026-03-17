<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('clientes', function (Blueprint $table) {
            $table->id(); // id bigint autoincremental
            $table->unsignedBigInteger('id_padron');
            $table->string('apellido', 100);
            $table->string('nombre', 100);
            $table->boolean('habilitado')->default(true);
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            // Definición de la relación con padron
            $table->foreign('id_padron')->references('id')->on('padron')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('clientes');
    }
};
