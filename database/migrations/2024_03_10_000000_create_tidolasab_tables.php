<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Reproduit le schéma de l'ancienne API PHP.
 * Les tables existent déjà en production : elles ne sont créées que si elles sont absentes.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('users')) {
            Schema::create('users', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->index('name_index');
                $table->string('email');
                $table->string('login');
                $table->string('password');
                $this->legacyTimestamps($table);
            });
        }

        if (! Schema::hasTable('clients')) {
            Schema::create('clients', function (Blueprint $table) {
                $table->increments('id');
                $table->string('nom');
                $table->string('prenom');
                $table->string('email');
                $table->string('telephone', 20);
                $table->text('adresse');
                $table->text('note')->nullable();
                $this->legacyTimestamps($table);
                $table->string('language', 2)->nullable()->default('fr');
            });
        }

        if (! Schema::hasTable('reservations')) {
            Schema::create('reservations', function (Blueprint $table) {
                $table->increments('id');
                $table->date('date_arrivee');
                $table->date('date_depart');
                $table->integer('nombre_nuits');
                $table->integer('adultes');
                $table->integer('enfants');
                $table->decimal('prix_total', 10, 2);
                $table->string('statut', 20)->default('en attente');
                $table->string('type')->nullable()->default('Classique');
                $table->text('note')->nullable();
                $this->legacyTimestamps($table);
            });
        }

        if (! Schema::hasTable('reservations_clients')) {
            Schema::create('reservations_clients', function (Blueprint $table) {
                $table->integer('id_reservation');
                $table->integer('id_client');
                $this->legacyTimestamps($table);
            });
        }

        if (! Schema::hasTable('paiements')) {
            Schema::create('paiements', function (Blueprint $table) {
                $table->increments('id');
                $table->integer('id_reservation');
                $table->decimal('montant_paiement', 10, 2);
                $table->date('date_paiement');
                $table->string('moyen_paiement')->default('Virement');
                $table->text('note')->nullable();
                $this->legacyTimestamps($table);
            });
        }
    }

    public function down(): void
    {
        // Tables de production : jamais supprimées par un rollback.
    }

    private function legacyTimestamps(Blueprint $table): void
    {
        $table->timestamp('created_at')->nullable()->useCurrent();
        $table->timestamp('updated_at')->nullable()->useCurrent()->useCurrentOnUpdate();
    }
};
