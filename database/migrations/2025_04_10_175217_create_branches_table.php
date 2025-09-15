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
        Schema::create('branches', function (Blueprint $table)
        {
            $table->id();
            $table->string('name')->collation('utf8mb4_general_ci')->unique();
            $table->unsignedBigInteger('street_id')->nullable();
            $table->integer('number')->nullable();;
            $table->string('phone', 20)->collation('utf8mb4_general_ci')->nullable();
            $table->string('email', 100)->collation('utf8mb4_general_ci')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedBigInteger('model_id_created');
            $table->unsignedBigInteger('model_id_updated')->nullable()->default(null);
            $table->timestamps();

            /* $table->foreign('street_id')
                ->references('id')
                ->on('calles')
                ->onDelete('cascade'); */

            $table->foreign('model_id_created')
                ->references('id')
                ->on('users');

            $table->foreign('model_id_updated')
                ->references('id')
                ->on('users');
        });

        Schema::create('model_has_branches', function (Blueprint $table)
        {
            $table->unsignedBigInteger('branch_id');
            $table->string('model_type');
            $table->unsignedBigInteger('model_id');

            $table->foreign('branch_id')
                ->references('id')
                ->on('branches')
                ->onDelete('cascade');

            $table->index(['model_id', 'model_type'], 'model_has_branches_model_id_model_type_index');
            $table->primary(['branch_id', 'model_id', 'model_type'], 'model_has_branches_branch_model_type_primary');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table)
        {
            $table->dropForeign(['street_id']);
            $table->dropForeign(['model_id_created']);
            $table->dropForeign(['model_id_updated']);
        });

        Schema::table('model_has_branches', function (Blueprint $table)
        {
            $table->dropForeign(['branch_id']);
        });

        Schema::dropIfExists('branches');
        Schema::dropIfExists('model_has_branches');
    }
};
