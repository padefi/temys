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
            $table->timestamps(); // created_at y updated_at

            // Definición de la relación con padron
            $table->foreign('id_padron')
                  ->references('id')
                  ->on('padron')
                  ->onDelete('cascade'); // Opcional: define el comportamiento al eliminar
        });
    }

    public function down()
    {
        Schema::dropIfExists('clientes');
    }
};
