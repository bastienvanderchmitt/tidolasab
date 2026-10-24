<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Requêtes envoyées comme par le front : Sanctum ouvre alors la session
        $this->withHeader('Referer', 'http://localhost');
    }
}
