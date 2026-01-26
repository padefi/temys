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
        Schema::create('orden_tesoreria_pago_cheques', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('orden_tesoreria_id');
            $table->foreign('orden_tesoreria_id')
                ->references('id')
                ->on('orden_tesoreria')
                ->onDelete('cascade');

            $table->unsignedBigInteger('cheque_id');
            $table->foreign('cheque_id')
                ->references('id')
                ->on('cheques')
                ->onDelete('cascade');

            $table->string('numero_cheque');
            $table->date('fecha_cheque');
            $table->string('numero_operacion')->nullable();


            $table->unsignedBigInteger('usuario_creacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orden_tesoreria_pago_cheques');
    }
};
