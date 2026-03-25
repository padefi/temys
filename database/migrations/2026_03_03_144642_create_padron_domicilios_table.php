<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('padron_domicilios', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['Cliente', 'Proveedor']);
            $table->unsignedBigInteger('tipo_id');
            $table->enum('tipo_domicilio', ['Real', 'Fiscal']);
            $table->string('calle_id', 64);
            $table->unsignedInteger('altura');
            $table->string('codigo_postal', 20)->nullable();
            $table->string('piso', 10)->nullable();
            $table->string('departamento', 20)->nullable();
            $table->text('observaciones')->nullable();
            $table->boolean('predeterminado')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            $table->index(['tipo', 'tipo_id']);

            //Índices y restricciones
            $table->unique(['tipo', 'tipo_id', 'tipo_domicilio', 'calle_id', 'altura'],'unique_tipo_tipoid_dom_calle_alt');

            //Relaciones
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padron_domicilios');
    }
};
