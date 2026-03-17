<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('relacion_proveedor_condicion', function (Blueprint $table) {
            $table->unsignedBigInteger('id_iva');
            $table->unsignedBigInteger('id_proveedor');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');

            //Clave primaria compuesta
            $table->primary(['id_iva', 'id_proveedor']);

            //Relaciones
            $table->foreign('id_iva')->references('id')->on('condicion_iva')->onDelete('cascade');
            $table->foreign('id_proveedor')->references('id')->on('proveedores')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('relacion_proveedor_condicion');
    }
};
