<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('relacion_cliente_condicion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_iva');
            $table->unsignedBigInteger('id_cliente');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');

            //Clave primaria compuesta
            $table->primary(['id_iva', 'id_cliente']);

            //Relaciones
            $table->foreign('id_iva')->references('id')->on('condicion_iva')->onDelete('cascade');
            $table->foreign('id_cliente')->references('id')->on('clientes')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('relacion_cliente_condicion');
    }
};
