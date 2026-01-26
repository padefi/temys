<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orden_tesoreria', function (Blueprint $table) {
            $table->id();
            $table->enum('tipo', ['pago', 'cobro']);
            $table->foreignId('plan_id')->constrained('plan')->onDelete('cascade');
            $table->foreignId('moneda_id')->constrained('tipo_monedas')->onDelete('cascade');
            $table->unsignedBigInteger('metodo_id');
            $table->foreign('metodo_id')->references('id')->on('metodo_tesoreria');
            $table->decimal('importe', 15, 2);
            $table->date('fecha');


            /*$table->foreignId('tarjeta_origen_id')->nullable()->constrained('tarjetas')->onDelete('cascade');
            $table->string('cbu_pago')->nullable();*/
            $table->enum('estado', ['Pendiente', 'Confirmado'])->default('Pendiente');
            $table->unsignedBigInteger('usuario_creacion');
            $table->unsignedBigInteger('usuario_aprobacion')->nullable();
            $table->timestamps();

            // Relaciones de usuarios
            $table->foreign('usuario_creacion')->references('id')->on('users');
            $table->foreign('usuario_aprobacion')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orden_tesoreria');
    }
};
