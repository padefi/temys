<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('proveedores', function (Blueprint $table) {
            $table->id(); // id bigint autoincremental
            $table->unsignedBigInteger('id_padron');
            $table->string('razon_social', 100);
            $table->string('nombre_fantasia', 100);
            $table->boolean('habilitado')->default(true);
            $table->enum('tipo', ['Humana', 'Jurídica']);
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            //Relaciones
            $table->foreign('id_padron')->references('id')->on('padron')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proveedores');
    }
};