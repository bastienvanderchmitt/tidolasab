<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Colonnes texte encodées en HTML par l'ancienne API (htmlspecialchars sur toutes les entrées).
     */
    private array $encodedColumns = [
        'clients' => ['nom', 'prenom', 'email', 'telephone', 'adresse', 'note'],
        'reservations' => ['note'],
        'paiements' => ['note'],
    ];

    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'remember_token')) {
                $table->rememberToken();
            }
        });

        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasIndex('users', 'users_login_unique')) {
                $table->unique('login');
            }
        });

        Schema::table('reservations_clients', function (Blueprint $table) {
            if (! Schema::hasIndex('reservations_clients', 'reservations_clients_id_reservation_id_client_unique')) {
                $table->unique(['id_reservation', 'id_client']);
            }
            if (! Schema::hasIndex('reservations_clients', 'reservations_clients_id_client_index')) {
                $table->index('id_client');
            }
        });

        Schema::table('paiements', function (Blueprint $table) {
            if (! Schema::hasIndex('paiements', 'paiements_id_reservation_index')) {
                $table->index('id_reservation');
            }
        });

        Schema::table('reservations', function (Blueprint $table) {
            if (! Schema::hasIndex('reservations', 'reservations_date_arrivee_date_depart_index')) {
                $table->index(['date_arrivee', 'date_depart']);
            }
        });

        // Les données sont désormais stockées brutes et échappées à l'affichage.
        foreach ($this->encodedColumns as $tableName => $columns) {
            DB::table($tableName)->orderBy('id')->each(function (object $row) use ($tableName, $columns) {
                $decoded = [];
                foreach ($columns as $column) {
                    if (is_string($row->$column) && preg_match('/&[a-z0-9#]+;/i', $row->$column)) {
                        $decoded[$column] = html_entity_decode($row->$column, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                    }
                }
                if ($decoded) {
                    DB::table($tableName)->where('id', $row->id)->update($decoded);
                }
            });
        }
    }

    public function down(): void
    {
        Schema::table('paiements', fn (Blueprint $table) => $table->dropIndex(['id_reservation']));
        Schema::table('reservations', fn (Blueprint $table) => $table->dropIndex(['date_arrivee', 'date_depart']));
        Schema::table('reservations_clients', function (Blueprint $table) {
            $table->dropUnique(['id_reservation', 'id_client']);
            $table->dropIndex(['id_client']);
        });
        Schema::table('users', function (Blueprint $table) {
            $table->dropUnique(['login']);
            $table->dropRememberToken();
        });
    }
};
