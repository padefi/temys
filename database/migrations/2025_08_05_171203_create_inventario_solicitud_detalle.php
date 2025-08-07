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
        Schema::create('inventario_solicitud_detalles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('solicitud_id');
            $table->unsignedBigInteger('producto_id');
            $table->integer('cantidad');
            $table->integer('cantidad_aprobada')->default(0);


            //Relaciones 
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('solicitud_id')->references('id')->on('inventario_solicitar_stocks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventario_solicitud_detalles');
    }
};
