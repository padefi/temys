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
        Schema::create('cuentas', function (Blueprint $table)
        {
            $table->id();
            $table->string('codigo', 11);
            $table->string('descripcion')->charset('utf8mb4')->collation('utf8mb4_unicode_ci');
            $table->unsignedBigInteger('rubro_id')->nullable();
            $table->unsignedBigInteger('ejercicio_id')->nullable();
            $table->unsignedBigInteger('model_id_created')->nullable();
            $table->timestamp('created_at');
            $table->unsignedBigInteger('model_id_updated')->nullable();
            $table->timestamp('updated_at')->nullable();

            $table->foreign('rubro_id')
                ->references('id')
                ->on('rubros')
                ->onDelete('cascade');

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

            $table->unique(['ejercicio_id', 'rubro_id', 'codigo'], 'unique_cuenta_codigo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cuentas', function (Blueprint $table)
        {
            $table->dropForeign(['rubro_padre_id']);
            $table->dropForeign(['ejercicio_id']);
            $table->dropForeign(['model_id_created']);
            $table->dropForeign(['model_id_updated']);
        });
    }
};
