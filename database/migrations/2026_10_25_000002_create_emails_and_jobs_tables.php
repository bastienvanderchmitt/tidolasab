<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Suivi des emails envoyés, affiché dans l'admin
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->uuid('token')->unique();
            $table->string('type', 50);
            $table->string('destinataire');
            $table->string('sujet')->nullable();
            $table->string('langue', 5)->nullable();
            $table->foreignId('id_reservation')->nullable()->index();
            $table->foreignId('id_client')->nullable()->index();
            $table->string('statut', 20)->index();
            $table->text('erreur')->nullable();
            $table->longText('html')->nullable();
            $table->timestamp('envoye_le')->nullable();
            $table->timestamp('ouvert_le')->nullable();
            $table->unsignedInteger('ouvertures')->default(0);
            $table->timestamps();
        });

        // File d'attente (driver « database ») : les emails partent en arrière-plan
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();
            $table->string('queue')->index();
            $table->longText('payload');
            $table->unsignedTinyInteger('attempts');
            $table->unsignedInteger('reserved_at')->nullable();
            $table->unsignedInteger('available_at');
            $table->unsignedInteger('created_at');
        });

        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();
            $table->string('uuid')->unique();
            $table->text('connection');
            $table->text('queue');
            $table->longText('payload');
            $table->longText('exception');
            $table->timestamp('failed_at')->useCurrent();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('failed_jobs');
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('emails');
    }
};
