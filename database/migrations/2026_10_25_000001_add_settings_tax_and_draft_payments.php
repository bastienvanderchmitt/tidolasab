<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Réglages modifiables depuis l'admin (tarifs, saisons, taxe...)
        Schema::create('settings', function (Blueprint $table) {
            $table->string('key')->primary();
            $table->json('value');
            $table->timestamps();
        });

        // Taxe de séjour comprise dans le prix, pour le chiffre d'affaires hors taxe
        Schema::table('reservations', function (Blueprint $table) {
            $table->decimal('taxe_sejour', 10, 2)->default(0)->after('prix_total');
        });

        // Jusqu'ici la taxe était toujours de 2 € par adulte et par nuit, sur les réservations directes
        DB::table('reservations')
            ->where('type', 'Classique')
            ->update(['taxe_sejour' => DB::raw('nombre_nuits * adultes * 2')]);

        // Un paiement « brouillon » est un solde attendu, pas encore encaissé
        Schema::table('paiements', function (Blueprint $table) {
            $table->string('statut', 20)->default('confirmé')->after('moyen_paiement');
            $table->index('statut');
        });
    }

    public function down(): void
    {
        Schema::table('paiements', function (Blueprint $table) {
            $table->dropIndex(['statut']);
            $table->dropColumn('statut');
        });
        Schema::table('reservations', fn (Blueprint $table) => $table->dropColumn('taxe_sejour'));
        Schema::dropIfExists('settings');
    }
};
