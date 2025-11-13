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
        Schema::table('co_asientos', function (Blueprint $table)
        {
            $table->decimal('importe', 20, 2)->after('concepto');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('co_asientos', function (Blueprint $table)
        {
            $table->dropColumn('importe');
        });
    }
};
