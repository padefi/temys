<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('relacion_cliente_proveedor', function (Blueprint $table) {
            $table->unsignedBigInteger('id_cliente');
            $table->unsignedBigInteger('id_proveedor');
            $table->timestamps();

            // Clave primaria compuesta
            $table->primary(['id_cliente', 'id_proveedor']);

            // Relaciones
            $table->foreign('id_cliente')
                  ->references('id')
                  ->on('clientes')
                  ->onDelete('cascade');

            $table->foreign('id_proveedor')
                  ->references('id')
                  ->on('proveedores')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('relacion_cliente_proveedor');
    }
};
