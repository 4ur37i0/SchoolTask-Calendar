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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id(); //id made by laravel

            //platform taks atributes 
            $table->string('course')->nullable(); //course name (optional for personal tasks)
            $table->text('title');
            $table->date('due_date');
            $table->enum('status', ['pendiente','hecho','atrasado'])->default('pendiente');

            //OPTIONAL FIELDS FOR PERSONAL TASKS
            //personal task atributes (EXTRAS)
            //This are optional fields that can be used for personal tasks, but are not required for platform tasks
            $table->text('description')->nullable(); //task description (optional for personal tasks)
            $table->enum('source_type', ['platform','personal'])->default('personal'); //indica si la tarea es interna o de plataforma
            $table->enum('priority', ['low','medium','high'])->default('medium'); //prioridad de la tarea

            $table->timestamps(); // created_at and updated_at made by laravel

            //Foreign keys
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); //Relation with user
            $table->foreignId('platform_id')->constrained()->onDelete('cascade'); //Relation with platform
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
