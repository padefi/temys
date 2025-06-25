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
        Schema::create('productos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('descripcion');
            $table->unsignedBigInteger('modelo_id');
            $table->unsignedBigInteger('subcategoria_id');
            $table->decimal('peso');
            $table->decimal('alto');
            $table->decimal('ancho');
            $table->decimal('volumen');
            $table->decimal('profundidad');
            $table->string('cod_barras');
            $table->string('es_inventario');
            $table->boolean('es_patrimonio');
            $table->string('referencia');
            $table->timestamp('fecha_creacion');
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion');
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();
            

            
             //Relaciones
            $table->foreign('modelo_id')->references('id')->on('productos_modelos');
            $table->foreign('subcategoria_id')->references('id')->on('productos_subcategorias');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('productos');
    }
};
