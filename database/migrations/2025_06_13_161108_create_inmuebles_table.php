<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
 public function up(): void
    {

        Schema::create('inmuebles', function (Blueprint $table) {
            $table->id();
            $table->string('num_partida', 25);
            $table->unsignedBigInteger('estado_id');
            $table->string('nombre_completo', 100);
            $table->string('nombre_fantasia', 100);
            $table->unsignedBigInteger('tipo_inmueble_id');
            $table->unsignedBigInteger('tipo_ocupacion_id');
            $table->decimal('superficie_cubierta', 10, 2)->default('0.00');
            $table->decimal('superficie_libre', 10, 2)->default('0.00');
            $table->decimal('superficie_total', 10, 2)->default('0.00');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            //Relaciones
            $table->foreign('estado_id')->references('id')->on('inmueble_tipo_estados');
            $table->foreign('tipo_inmueble_id')->references('id')->on('inmueble_tipos');        
            $table->foreign('tipo_ocupacion_id')->references('id')->on('Inmueble_tipo_ocupacions');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('inmuebles');
    }
};
