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
        Schema::create('orden_compra_orden_cotizaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_compra_id');
            $table->unsignedBigInteger('orden_cotizacion_id');
            $table->timestamps();

            $table->foreign('orden_compra_id')->references('id')->on('orden_compras')->onDelete('cascade');
            $table->foreign('orden_cotizacion_id')->references('id')->on('orden_cotizaciones')->onDelete('cascade');


            $table->unique(['orden_compra_id', 'orden_cotizacion_id'], 'compra_orden_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compra_orden_cotizaciones');
    }
};
