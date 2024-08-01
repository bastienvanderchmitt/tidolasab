<?php

class Connexion extends PDO
{
    private int $deepTransactionCount;

    public function __construct(string $host, string $name, string $user, string $pass, int $port = 3306)
    {
        parent::__construct("mysql:host=$host;dbname=$name;port=$port", $user, $pass, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8', PDO::ATTR_STRINGIFY_FETCHES => true));
        $this->deepTransactionCount = 0;
    }

    public function safeExecute(string $query, array $params = []): PDOStatement|false
    {
        $statement = $this->prepare($query);
        if (!$statement) return false;

        $statement->execute($params);
        return $statement;
    }

    public function safeFetch(string $query, array $params = [], int $fetchMode = PDO::FETCH_OBJ): object|bool
    {
        $statement = $this->safeExecute($query, $params);
        $result = $statement->fetch($fetchMode);
        $statement->closeCursor();

        return $result;
    }

    public function safeFetchAll(string $query, array $params = [], int $fetchMode = PDO::FETCH_OBJ): array|bool
    {
        $statement = $this->safeExecute($query, $params);
        $result = $statement->fetchAll($fetchMode);
        $statement->closeCursor();

        return $result;
    }

    public function beginTransaction(): bool
    {
        $this->deepTransactionCount++;

        if ($this->inTransaction())
            return true;

        return parent::beginTransaction();
    }

    public function commit(): bool
    {
        $this->deepTransactionCount--;

        if ($this->deepTransactionCount == 0 && $this->inTransaction())
            return parent::commit();

        return false;
    }

    public function rollBack(): bool
    {
        if ($this->inTransaction()) {
            $this->deepTransactionCount = 0;
            return parent::rollBack();
        }

        return false;
    }
}
