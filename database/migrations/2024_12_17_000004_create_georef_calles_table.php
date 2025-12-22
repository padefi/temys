<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migración de calles con nombres de columnas idénticos al CSV de Georef
     * 
     * CSV: altura_fin_derecha, altura_fin_izquierda, altura_inicio_derecha, altura_inicio_izquierda,
     *      categoria, departamento_id, departamento_nombre, fuente, id, localidad_censal_id,
     *      localidad_censal_nombre, localidad_id, localidad_nombre, nombre, provincia_id, provincia_nombre
     */
    public function up(): void
    {
        Schema::create('georef_calles', function (Blueprint $table) {
            // Columnas exactamente como en el CSV de Georef
            $table->unsignedInteger('altura_fin_derecha')->nullable();
            $table->unsignedInteger('altura_fin_izquierda')->nullable();
            $table->unsignedInteger('altura_inicio_derecha')->nullable();
            $table->unsignedInteger('altura_inicio_izquierda')->nullable();
            $table->string('categoria', 50)->nullable();
            $table->string('departamento_id', 10)->nullable();
            $table->string('departamento_nombre', 150)->nullable();
            $table->string('fuente', 50)->nullable();
            $table->string('id', 20)->primary()->comment('ID oficial de Georef');
            $table->string('localidad_censal_id', 20)->nullable();
            $table->string('localidad_censal_nombre', 150)->nullable();
            $table->string('localidad_id', 20)->nullable();
            $table->string('localidad_nombre', 150)->nullable();
            $table->string('nombre', 200);
            $table->string('provincia_id', 10);
            $table->string('provincia_nombre', 100)->nullable();
            
            $table->timestamps();
            
            // Índices optimizados para búsquedas
            $table->index('nombre');
            $table->index('provincia_id');
            $table->index('departamento_id');
            $table->index('localidad_censal_id');
            $table->index(['altura_inicio_derecha', 'altura_fin_derecha']);
            $table->fullText('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('georef_calles');
    }
};
