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
        Schema::create('asientos', function (Blueprint $table)
        {
            $table->id();
            $table->integer('numero');
            $table->unsignedBigInteger('ejercicio_id');
            $table->date('fecha');
            $table->string('concepto');
            $table->enum('estado', ['PENDIENTE', 'CONTROLADO', 'ANULADO']);
            $table->unsignedBigInteger('model_id_created')->nullable();
            $table->timestamp('created_at');
            $table->unsignedBigInteger('model_id_updated')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->unsignedBigInteger('model_id_confirmed')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->unsignedBigInteger('model_id_voided')->nullable();
            $table->timestamp('voided_at')->nullable();

            $table->foreign('ejercicio_id')
                ->references('id')
                ->on('ejercicios')
                ->onDelete('cascade');

            $table->foreign('model_id_created')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_updated')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_confirmed')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_voided')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asientos', function (Blueprint $table)
        {
            $table->dropForeign(['ejercicio_id']);
            $table->dropForeign(['model_id_created']);
            $table->dropForeign(['model_id_updated']);
            $table->dropForeign(['model_id_confirmed']);
            $table->dropForeign(['model_id_voided']);
        });
    }
};
