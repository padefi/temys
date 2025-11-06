<?php
// database/migrations/2025_09_23_000002_create_cheques_table.php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('cheques', function (Blueprint $table) {
            $table->id();
            $table->string('numero');
            $table->unsignedBigInteger('cuenta_bancaria_id');
            $table->timestamps();

               $table->foreign('cuenta_bancaria_id')
                    ->references('id')
                    ->on('cuenta_bancarias')
                    ->onDelete('cascade');
        });
    }

    public function down(): void {
        Schema::dropIfExists('cheques');
    }
};

