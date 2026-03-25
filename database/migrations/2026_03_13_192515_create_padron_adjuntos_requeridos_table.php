<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('padron_adjuntos_requeridos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['Cliente', 'Proveedor']);
            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('tipo_adjunto');
            $table->string('nombre_archivo', 255);
            $table->string('ruta_archivo', 500);
            $table->date('fecha_adjunto')->nullable();

            $table->timestamp('fecha_carga')->useCurrent();
            $table->unsignedBigInteger('usuario_carga')->nullable();

            $table->dateTime('fecha_modificacion')->nullable();
            $table->unsignedBigInteger('usuario_modificacion')->nullable();

            $table->index(['tipo', 'tipo_id']);
            $table->index(['tipo_adjunto']);

            $table->foreign('tipo_adjunto')->references('id')->on('tipo_adjuntos');
            $table->foreign('usuario_carga')->references('id')->on('users');
            $table->foreign('usuario_modificacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padron_adjuntos_obligatorios');
    }
};
