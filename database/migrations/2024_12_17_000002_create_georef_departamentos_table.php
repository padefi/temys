<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Migración de departamentos con nombres de columnas idénticos al CSV de Georef
     * 
     * CSV: categoria, centroide_lat, centroide_lon, fuente, id, nombre, nombre_completo, 
     *      provincia_id, provincia_interseccion, provincia_nombre
     */
    public function up(): void
    {
        Schema::create('georef_departamentos', function (Blueprint $table) {
            // Columnas exactamente como en el CSV de Georef
            $table->string('categoria', 50)->nullable();
            $table->decimal('centroide_lat', 10, 7)->nullable();
            $table->decimal('centroide_lon', 10, 7)->nullable();
            $table->string('fuente', 50)->nullable();
            $table->string('id', 10)->primary()->comment('ID oficial de Georef');
            $table->string('nombre', 150);
            $table->string('nombre_completo', 200)->nullable();
            $table->string('provincia_id', 10);
            $table->decimal('provincia_interseccion', 20, 16)->nullable();
            $table->string('provincia_nombre', 100)->nullable();
            
            $table->timestamps();
            
            // Índices para búsqueda rápida
            $table->index('nombre');
            $table->index('provincia_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('georef_departamentos');
    }
};
