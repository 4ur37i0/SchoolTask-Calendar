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
        Schema::create('users_platforms', function (Blueprint $table) {
            $table->id(); //id made by laravel 

            //foreign keys
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('platform_id')->constrained()->onDelete('cascade');

            //token for authentication
            $table->string('token')->unique(); 

            //constraints for unique user-platform combination
            $table->unique(['user_id', 'platform_id']); //Un usuario no puede tener repetida la misma plataforma
            
            $table->timestamps(); //created_at and updated_at made by laravel
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users_platforms');
    }
};
