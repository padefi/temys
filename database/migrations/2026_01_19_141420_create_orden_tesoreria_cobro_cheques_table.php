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
        Schema::create('orden_tesoreria_cobro_cheque', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('orden_tesoreria_id');
            $table->foreign('orden_tesoreria_id')
                ->references('id')
                ->on('orden_tesoreria')
                ->onDelete('cascade');

            $table->date('fecha_cheque')->nullable();

            $table->string('numero_cheque')->nullable();

            $table->unsignedBigInteger('banco_emisor_id')->nullable();
            $table->foreign('banco_emisor_id')
                ->references('id')
                ->on('bancos')
                ->onDelete('cascade');

            $table->unsignedBigInteger('banco_destino_id')->nullable();
            $table->foreign('banco_destino_id')
                ->references('id')
                ->on('bancos')
                ->onDelete('cascade');

            $table->unsignedBigInteger('cuenta_destino_id')->nullable();
            $table->foreign('cuenta_destino_id')
                ->references('id')
                ->on('cuenta_bancarias')
                ->onDelete('cascade');

            $table->string('numero_operacion')->nullable();

            $table->unsignedBigInteger('usuario_creacion');
            $table->foreign('usuario_creacion')->references('id')->on('users');

            $table->timestamps();


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_tesoreria_cobro_cheque');
    }
};
