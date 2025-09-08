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
        Schema::create('ejercicios', function (Blueprint $table)
        {
            $table->id();
            $table->string('descripcion')->charset('utf8mb4')->collation('utf8mb4_unicode_ci')->unique();
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->enum('estado', ['ABIERTO', 'CERRADO', 'ANULADO']);
            $table->unsignedBigInteger('model_id_created')->nullable();
            $table->timestamp('created_at');
            $table->unsignedBigInteger('model_id_updated')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('model_id_created')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_updated')
                ->references('id')
                ->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ejercicios', function (Blueprint $table)
        {
            $table->dropForeign(['model_id_created']);
            $table->dropForeign(['model_id_updated']);
        });
    }
};
