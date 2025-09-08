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
        Schema::create('partidas', function (Blueprint $table)
        {
            $table->id();
            $table->unsignedBigInteger('asiento_id');
            $table->unsignedBigInteger('subcuenta_id');
            $table->string('concepto');
            $table->decimal('debe', 20, 2);
            $table->decimal('haber', 20, 2);

            $table->foreign('asiento_id')
                ->references('id')
                ->on('asientos')
                ->onDelete('cascade');

            $table->foreign('subcuenta_id')
                ->references('id')
                ->on('subcuentas')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('partidas', function (Blueprint $table)
        {
            $table->dropForeign(['asiento_id']);
            $table->dropForeign(['subcuenta_id']);
        });
    }
};
