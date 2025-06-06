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
            $table->timestamps();

            // Clave primaria compuesta
            $table->primary(['id_iva', 'id_cliente']);

            // Relaciones
            $table->foreign('id_iva')
                  ->references('id')
                  ->on('condicion_iva')
                  ->onDelete('cascade');

            $table->foreign('id_cliente')
                  ->references('id')
                  ->on('clientes')
                  ->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('relacion_cliente_condicion');
    }
};
