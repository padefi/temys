<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('padron_contactos', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['Cliente', 'Proveedor']);
            $table->unsignedBigInteger('tipo_id');
            $table->unsignedBigInteger('tipo_contacto'); // FK tipo_contactos.id
            $table->string('contacto', 150);
            $table->boolean('predeterminado')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            $table->index(['tipo', 'tipo_id']);

            //Índices y restricciones
            $table->unique(['tipo', 'tipo_id', 'tipo_contacto', 'contacto'],'unique_tipo_tipoid_tipcont_contac');

            //Relaciones
            $table->foreign('tipo_contacto')->references('id')->on('tipo_contactos')->onDelete('cascade');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padron_contactos');
    }
};
