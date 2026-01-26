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
        Schema::create('orden_tesoreria_cobro_tarjeta', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('orden_tesoreria_id');
            $table->foreign('orden_tesoreria_id')
                ->references('id')
                ->on('orden_tesoreria')
                ->onDelete('cascade');

            $table->string('numero_operacion')->nullable();

            $table->unsignedBigInteger('usuario_creacion');
            $table->timestamps();

            //Relaciones de usuarios
            $table->foreign('usuario_creacion')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_tesoreria_cobro_tarjeta');
    }
};
