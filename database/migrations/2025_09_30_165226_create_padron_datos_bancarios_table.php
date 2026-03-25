<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('padron_datos_bancarios', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['Cliente', 'Proveedor']);
            $table->unsignedBigInteger('tipo_id');
            $table->enum('tipo_clave', ['Cbu', 'Cvu', 'Undefined'])->default('Undefined');
            $table->string('clave', 22)->nullable();
            $table->string('alias', 255)->nullable();
            $table->unsignedBigInteger('entidad_financiera');
            $table->unsignedBigInteger('moneda');
            $table->enum('tipo_cuenta', ['Caja de Ahorro', 'Cuenta Corriente', 'Undefined'])->default('Undefined');
            $table->boolean('predeterminado')->default(false);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            $table->index(['tipo', 'tipo_id']);

            //Índices y restricciones
            //Un Tipo(Cliente) con TipoID(1) | Tipo(Proveedor) con TipoID(1) NO puede repetir clave ni alias
            $table->unique(['tipo', 'tipo_id', 'clave']);
            $table->unique(['tipo', 'tipo_id', 'alias']);

            //Relaciones
            $table->foreign('entidad_financiera')->references('id')->on('entidades_financieras');
            $table->foreign('moneda')->references('id')->on('tipo_monedas');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('padron_datos_bancarios');
    }
};
