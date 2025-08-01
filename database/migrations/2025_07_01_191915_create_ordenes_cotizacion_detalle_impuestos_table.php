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
        Schema::create('orden_cotizaciones_detalle_impuestos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_cotizaciones_detalle_id');
            $table->unsignedBigInteger('impuesto_id');
            $table->timestamps();

            $table->foreign('orden_cotizaciones_detalle_id', 'ocd_impuestos_detalle_fk')
                ->references('id')
                ->on('orden_cotizaciones_detalle');
            $table->foreign('impuesto_id')->references('id')->on('impuestos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_cotizaciones_detalle_impuestos');
    }
};
