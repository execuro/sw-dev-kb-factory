---
id: platform/dev/6.7/guides/hosting/infrastructure/database.md
title: Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/database.html
sourceHash: 3fb10b767fb90eb1b0961e80c29615b05d69baed
codeCheckedAgainst: "6.7.13.0"
keywords: ["DATABASE_URL", "DATABASE_REPLICA_0_URL", "DATABASE_SSL_CA", "DATABASE_SSL_DONT_VERIFY_SERVER_CERT", "DATABASE_PERSISTENT_CONNECTION", "DATABASE_PROTOCOL_COMPRESSION", "MySQLFactory", "mysql read replica", "database cluster", "proxysql", "tls ssl database", "mysql server has gone away", "doctrine-mysql-come-back"]
summary: "MySQL setup for Shopware: primary/replica env vars, DATABASE_SSL_* TLS, persistent connections, compression, reconnect wrapper for long-running workers."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md"]
---
## What it is

Operating guide for Shopware's MySQL/MariaDB connection: primary/replica splitting, TLS, persistent connections, compression and reconnects for long-lived workers. All settings are environment variables read by `Shopware\Core\Framework\Adapter\Database\MySQLFactory`.

## When to use

- Scaling reads with a database cluster (ProxySQL in front of the cluster is recommended over pointing Shopware at several servers).
- Managed databases that require TLS (e.g. Amazon RDS/Aurora).
- FrankenPHP worker mode or CLI consumers hitting `wait_timeout` (`MySQL server has gone away`).

## Key steps / config

**Session variables.** `MySQLFactory` sends PDO init commands on every connection (primary and replicas): UTC `time_zone`, `group_concat_max_len` raised to at least `320000`, and `ONLY_FULL_GROUP_BY` removed from `sql_mode`.

**Cluster** (`.env`):

- `DATABASE_URL` — primary.
- `DATABASE_REPLICA_0_URL`, `DATABASE_REPLICA_1_URL`, … — read-only servers. A non-empty `DATABASE_REPLICA_0_URL` switches to Doctrine's `PrimaryReadReplicaConnection` unless the DSN sets `wrapperClass`. After a write, the request stays on the primary.

**TLS** (`.env.local`):

```dotenv
DATABASE_URL="mysql://username:password@host:3306/dbname"
DATABASE_SSL_CA="/etc/ssl/certs/db-ca.pem"
DATABASE_SSL_CERT="/etc/ssl/certs/db-client-cert.pem"
DATABASE_SSL_KEY="/etc/ssl/certs/db-client-key.pem"
```

`DATABASE_SSL_DONT_VERIFY_SERVER_CERT=1` skips verification (non-production). Force TLS without a CA: `DATABASE_SSL_CA=true` + `DATABASE_SSL_DONT_VERIFY_SERVER_CERT=1`. For RDS/Aurora, set `DATABASE_SSL_CA` to the AWS RDS CA bundle. Verify with `SHOW STATUS LIKE 'Ssl_cipher';` (non-empty = encrypted).

**Tuning.** `DATABASE_PERSISTENT_CONNECTION` (truthy → `PDO::ATTR_PERSISTENT`, reuse connections in workers/high churn); `DATABASE_PROTOCOL_COMPRESSION` (truthy → compressed wire protocol, less bandwidth, slight CPU cost).

**Reconnects.** `composer require facile-it/doctrine-mysql-come-back`, then:

```dotenv
DATABASE_URL="mysql://user:pw@host:3306/db?wrapperClass=Facile\DoctrineMySQLComeBack\Doctrine\DBAL\Connection&driverOptions[x_reconnect_attempts]=3"
```

With replicas use `Facile\DoctrineMySQLComeBack\Doctrine\DBAL\Connections\PrimaryReadReplicaConnection` as `wrapperClass`.

## Essential identifiers

- `MySQLFactory`, `DATABASE_URL`, `DATABASE_REPLICA_x_URL`
- `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT`
- `DATABASE_PERSISTENT_CONNECTION`, `DATABASE_PROTOCOL_COMPRESSION`

## Gotchas

- Replica variables are read from index 0 until the first empty one — keep numbering contiguous.
- Replica lag is not handled by Shopware; it is left to MySQL replication.
- Avoid persistent connections with read replicas (wrong-node pinning) and on large PHP-FPM fleets (exhausts `max_connections`); use them on dedicated worker servers.
- `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` is silently ignored unless `\Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT` is defined (docs: PHP 8.2+, `ext-pdo_mysql`).
- The docs suggest `SQL_SET_DEFAULT_SESSION_VARIABLES=0` to skip the session setup; the installed code never reads it.
- The docs' first reconnect example duplicates `?wrapperClass=`; use it once.

## Code check (6.7.13.0)
- confirmed `MySQLFactory::create()` — builds the connection from DATABASE_* env vars — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:37
- corrected `group_concat_max_len` — docs: must be set on the server, Shopware sets it only on replicas in cluster mode; code sets it via init command on every connection — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:63
- corrected `ONLY_FULL_GROUP_BY` — docs: must be removed server-side; code strips it from sql_mode on every connection — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:64
- absent `SQL_SET_DEFAULT_SESSION_VARIABLES` — not read anywhere in the installed Shopware packages
- confirmed `DATABASE_SSL_CA` — mapped to the PDO MySQL SSL CA option — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — applied only if the Pdo\Mysql constant is defined — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:81
- confirmed `DATABASE_PERSISTENT_CONNECTION` — sets PDO::ATTR_PERSISTENT — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:85
- confirmed `DATABASE_PROTOCOL_COMPRESSION` — sets Mysql::ATTR_COMPRESS — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:89
- confirmed `DATABASE_REPLICA_0_URL` — non-empty value enables the primary/replica wrapper — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:93
- confirmed `wrapperClass` — a wrapperClass from the DSN is kept, else PrimaryReadReplicaConnection — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:95
