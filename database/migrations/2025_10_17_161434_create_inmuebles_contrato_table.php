<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inmuebles_contrato', function (Blueprint $table) {
            $table->id('id');
            $table->unsignedBigInteger('inmuebles_id');
            $table->unsignedBigInteger('inmuebles_tipo_contrato_id');              
            $table->date('fecha_contrato')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_final')->nullable();
            $table->decimal('importe', 12, 2)->nullable();
            $table->string('observacion')->nullable();

            // Auditoría
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();


            //Relaciones
            $table->foreign('inmuebles_id')->references('id')->on('inmuebles');
            $table->foreign('inmuebles_tipo_contrato_id')->references('id')->on('inmuebles_tipo_contrato');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inmuebles_contrato');
    }
};
