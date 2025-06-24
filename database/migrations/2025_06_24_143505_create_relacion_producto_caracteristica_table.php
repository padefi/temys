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
        Schema::create('relacion_producto_caracteristica', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('producto_id');
            $table->unsignedBigInteger('caracteristicas_id');


            //relaciones
            $table->foreign('producto_id')->references('id')->on('productos');
            $table->foreign('caracteristicas_id')->references('id')->on('productos_categorias');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('relacion_producto_caracteristica');
    }
};
