<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProveedorDatosBancariosTable extends Migration
{
    public function up(): void
    {
        Schema::create('proveedor_datos_bancarios', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_proveedor');
            $table->enum('tipo_clave', ['Cbu', 'Cvu', 'Undefined'])->default('Undefined');
            $table->string('clave', 22);
            $table->string('alias', 255)->nullable();
            $table->unsignedBigInteger('entidad_financiera');
            $table->unsignedBigInteger('moneda');
            $table->enum('tipo_cuenta', ['Caja de Ahorro', 'Cuenta Corriente', 'Undefined'])->default('Undefined');
            $table->boolean('predeterminado')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            //Índices y restricciones
            //Un proveedor NO puede repetir clave ni alias
            $table->unique(['id_proveedor', 'clave']);
            $table->unique(['id_proveedor', 'alias']);
            
            //Relaciones
            $table->foreign('id_proveedor')->references('id')->on('proveedores')->onDelete('cascade');
            $table->foreign('entidad_financiera')->references('id')->on('entidades_financieras');
            $table->foreign('moneda')->references('id')->on('tipo_monedas');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proveedor_datos_bancarios');
    }
}

