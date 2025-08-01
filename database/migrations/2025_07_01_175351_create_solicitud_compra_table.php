<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('solicitud_compras', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('origen_id')->nullable();
            $table->string('descripcion');
            $table->enum('estado', ['Pendiente', 'Aceptada', 'Rechazada']);
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            $table->timestamps();


            $table->foreign('usuario_id')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
            $table->foreign('origen_id')->references('id')->on('origenes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('solicitud_compras');
    }
};
