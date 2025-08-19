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
            $table->unsignedBigInteger('orden_compras_id');
            $table->unsignedBigInteger('orden_cotizaciones_id');
            $table->timestamps();

            $table->foreign('orden_compras_id')->references('id')->on('orden_compras')->onDelete('cascade');
            $table->foreign('orden_cotizaciones_id')->references('id')->on('orden_cotizaciones')->onDelete('cascade');


            $table->unique(['orden_compras_id', 'orden_cotizaciones_id'], 'compra_orden_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compras_orden_cotizaciones');
    }
};
