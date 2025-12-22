<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migración de localidades con nombres de columnas idénticos al CSV de Georef
     * 
     * CSV: categoria, centroide_lat, centroide_lon, departamento_id, departamento_nombre, 
     *      fuente, id, localidad_censal_id, localidad_censal_nombre, municipio_id, 
     *      municipio_nombre, nombre, provincia_id, provincia_nombre
     */
    public function up(): void
    {
        Schema::create('georef_localidades', function (Blueprint $table) {
            // Columnas exactamente como en el CSV de Georef
            $table->string('categoria', 50)->nullable();
            $table->decimal('centroide_lat', 10, 7)->nullable();
            $table->decimal('centroide_lon', 10, 7)->nullable();
            $table->string('departamento_id', 10)->nullable();
            $table->string('departamento_nombre', 150)->nullable();
            $table->string('fuente', 50)->nullable();
            $table->string('id', 20)->primary()->comment('ID oficial de Georef');
            $table->string('localidad_censal_id', 20)->nullable();
            $table->string('localidad_censal_nombre', 150)->nullable();
            $table->string('municipio_id', 20)->nullable();
            $table->string('municipio_nombre', 150)->nullable();
            $table->string('nombre', 150);
            $table->string('provincia_id', 10);
            $table->string('provincia_nombre', 100)->nullable();
            
            $table->timestamps();
            
            // Índices para búsqueda rápida
            $table->index('nombre');
            $table->index('provincia_id');
            $table->index('departamento_id');
            $table->fullText('nombre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('georef_localidades');
    }
};
