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
        Schema::create('plantations', function (Blueprint $table) {
            $table->id();
            $table->integer('objectid')->nullable();
            $table->string('type')->nullable();
            $table->decimal('percent', 8, 2)->nullable();
            $table->string('spec_1')->nullable();
            $table->string('spec_2')->nullable();
            $table->string('spec_3')->nullable();
            $table->string('spec_4')->nullable();
            $table->string('spec_5')->nullable();
            $table->string('spec_simp')->nullable();
            $table->string('country')->nullable();
            $table->json('geometry');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plantations');
    }
};
