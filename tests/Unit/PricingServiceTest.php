<?php

use App\Services\PricingService;

function quote(string $checkIn, string $checkOut, int $adults = 2): array
{
    return app(PricingService::class)->quote($checkIn, $checkOut, $adults)->jsonSerialize();
}

it('facture chaque nuit au tarif haute saison et ajoute la taxe de séjour', function () {
    expect(quote('2026-12-01', '2026-12-04'))->toMatchArray([
        'nights' => 3,
        'high_season_nights' => 3,
        'low_season_nights' => 0,
        'tourist_tax' => 12.0, // 3 nuits x 2 adultes x 2 €
        'discount' => 0.0,
        'total' => 342.0,      // 3 x 110 + 12
    ]);
});

it('ne facture pas le jour du départ', function () {
    // Arrivée le 30 oct. (basse saison), départ le 1er nov. : 2 nuits d'octobre
    expect(quote('2026-10-30', '2026-11-01', 1))->toMatchArray([
        'nights' => 2,
        'low_season_nights' => 2,
        'high_season_nights' => 0,
        'total' => 204.0,
    ]);
});

it('répartit un séjour à cheval sur les deux saisons', function () {
    expect(quote('2026-10-30', '2026-11-02', 1))->toMatchArray([
        'low_season_nights' => 2,
        'high_season_nights' => 1,
        'total' => 2 * 100 + 110 + 3 * 2.0,
    ]);
});

it('offre une demi-nuit par tranche de 7 nuits', function () {
    // 7 nuits de septembre : 700 €, remise de 700 / 7 / 2 = 50 €
    expect(quote('2026-09-01', '2026-09-08', 1))->toMatchArray([
        'discount' => 50.0,
        'total' => 700 + 14 - 50.0,
    ]);

    // 14 nuits : deux demi-nuits
    expect(quote('2026-09-01', '2026-09-15', 1)['discount'])->toBe(100.0);
});

it('applique les tarifs 2027 selon l’année d’arrivée', function () {
    expect(quote('2027-02-01', '2027-02-03', 1))->toMatchArray([
        'high_season_price' => 115.0,
        'total' => 2 * 115 + 4.0,
    ]);

    expect(quote('2027-09-10', '2027-09-12', 1)['low_season_price'])->toBe(105.0);

    // Arrivée fin 2026 : tout le séjour reste au tarif 2026
    expect(quote('2026-12-30', '2027-01-02', 1)['high_season_price'])->toBe(110.0);
});
