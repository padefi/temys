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
     
      /*   Schema::table('inventario_stocks', function (Blueprint $table) {
            $table->unsignedBigInteger('cantidad_contada')->nullable()->after('cantidad_actual');     
        }); */
    }

    /**
     * Reverse the migrations.
     */
    

    public function down(): void
    {
        Schema::table('inventario_stocks', function (Blueprint $table) {
            //
        });
    }
};
