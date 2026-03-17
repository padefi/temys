<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('entidades_financieras', function (Blueprint $table) {
            $table->id();
            $table->string('descripcion', 255);
            $table->enum('tipo', ['Banco', 'Billetera Virtual', 'Financiera']);
            $table->unsignedBigInteger('nacionalidad')->nullable();
            $table->string('clave_unica', 8)->unique(); //3 dígitos (CBU) o 8 dígitos (CVU)
            $table->boolean('habilitado')->default(true);
            $table->timestamp('fecha_creacion')->useCurrent();
            $table->unsignedBigInteger('usuario_creacion');
            $table->dateTime('fecha_actualizacion')->nullable();
            $table->unsignedBigInteger('usuario_actualizacion')->nullable();

            //Relaciones
            $table->foreign('nacionalidad')->references('id')->on('nacionalidades');
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_actualizacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('entidades_financieras');
    }
};
