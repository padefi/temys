<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('nacionalidades', function (Blueprint $table) {
            $table->id();
            $table->char('id_nac', 3)->unique();
            $table->string('nacionalidad', 25);
            $table->unsignedTinyInteger('orden');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nacionalidades');
    }
};