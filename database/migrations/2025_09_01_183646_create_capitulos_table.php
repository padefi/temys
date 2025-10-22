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
        Schema::create('co_capitulos', function (Blueprint $table)
        {
            $table->id();
            $table->string('codigo', 1);
            $table->string('descripcion')->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->unsignedBigInteger('co_ejercicio_id');
            $table->unsignedBigInteger('model_id_created')->nullable();
            $table->timestamp('created_at');
            $table->unsignedBigInteger('model_id_updated')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('co_ejercicio_id')
                ->references('id')
                ->on('co_ejercicios')
                ->onDelete('cascade');

            $table->foreign('model_id_created')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_updated')
                ->references('id')
                ->on('users');

            $table->unique(['co_ejercicio_id', 'codigo'], 'unique_co_capitulo_codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('co_capitulos', function (Blueprint $table)
        {
            $table->dropForeign(['co_ejercicio_id']);
            $table->dropForeign(['model_id_created']);
            $table->dropForeign(['model_id_updated']);
        });
    }
};
