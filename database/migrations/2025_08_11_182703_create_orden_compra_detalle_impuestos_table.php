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
        Schema::create('orden_compras_detalles_impuestos', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_compras_detalles_id');
            $table->unsignedBigInteger('impuesto_id');
            $table->timestamps();

            $table->foreign('orden_compras_detalles_id', 'ocompras_impuestos_detalle_fk')
                ->references('id')
                ->on('orden_compras_detalles');
            $table->foreign('impuesto_id')->references('id')->on('impuestos');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_compras_detalles_impuestos');
    }
};
