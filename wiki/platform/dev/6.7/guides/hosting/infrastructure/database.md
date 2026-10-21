---
id: platform/dev/6.7/guides/hosting/infrastructure/database.md
title: Database
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/hosting/infrastructure/database.html
sourceHash: 3fb10b767fb90eb1b0961e80c29615b05d69baed
codeCheckedAgainst: "6.7.15.1"
relatedPages: ["platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md"]
keywords: ["DATABASE_URL", "DATABASE_REPLICA_0_URL", "DATABASE_SSL_CA", "DATABASE_SSL_DONT_VERIFY_SERVER_CERT", "DATABASE_PERSISTENT_CONNECTION", "DATABASE_PROTOCOL_COMPRESSION", "MySQLFactory", "PrimaryReadReplicaConnection", "read replica", "database cluster", "mysql tls", "proxysql", "doctrine-mysql-come-back"]
summary: "Shopware MySQL setup: read replicas (DATABASE_REPLICA_x_URL), TLS (DATABASE_SSL_*), persistent/compressed connections, worker reconnects."
lastBuilt: 2026-10-21
---
## What it is

How to run Shopware against a production database: a primary/read-replica cluster, TLS-encrypted MySQL/MariaDB connections, connection tuning, and reconnect handling for long-running PHP workers. All settings are environment variables read by `Shopware\Core\Framework\Adapter\Database\MySQLFactory`.

## When to use

- Scaling read traffic with a MySQL cluster (one primary, several read-only nodes).
- A managed/cloud database (e.g. Amazon RDS/Aurora) that requires TLS.
- FrankenPHP worker mode or CLI message consumers hitting `MySQL server has gone away` after `wait_timeout`.

## Key steps / config

**Cluster.** The docs recommend ProxySQL in front of the cluster rather than pointing the application at several servers. To let Shopware split reads itself, set in `.env`:

- `DATABASE_URL` — the primary.
- `DATABASE_REPLICA_0_URL`, `DATABASE_REPLICA_1_URL`, … — read-only nodes, read from index 0 until one is missing.

With `DATABASE_REPLICA_0_URL` set, the connection uses `Doctrine\DBAL\Connections\PrimaryReadReplicaConnection` (unless the DSN sets `wrapperClass`), `keepReplica` defaulting to `true`. After a write, the primary is used for the rest of the request; replica lag is left to replication.

**Session variables.** Every connection runs init commands that raise `group_concat_max_len` to at least `320000` and remove `ONLY_FULL_GROUP_BY` from `sql_mode`. Setting the same on the MySQL servers is still sensible but not required by the code.

**TLS** (`.env.local`):

```dotenv
DATABASE_URL="mysql://username:password@host:3306/dbname"
DATABASE_SSL_CA="/etc/ssl/certs/db-ca.pem"
DATABASE_SSL_CERT="/etc/ssl/certs/db-client-cert.pem"
DATABASE_SSL_KEY="/etc/ssl/certs/db-client-key.pem"
# DATABASE_SSL_DONT_VERIFY_SERVER_CERT=1   (non-production only)
```

Force TLS without a CA file (dev/staging only): `DATABASE_SSL_CA=true` plus `DATABASE_SSL_DONT_VERIFY_SERVER_CERT=1`. For RDS/Aurora, point `DATABASE_SSL_CA` at the AWS bundle `https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem`. Verify with `SHOW STATUS LIKE 'Ssl_cipher';` — non-empty means encrypted.

**Tuning.** `DATABASE_PERSISTENT_CONNECTION` reuses connections across requests (for dedicated worker servers); `DATABASE_PROTOCOL_COMPRESSION` compresses MySQL wire traffic (for bandwidth-constrained links).

**Long-running workers.** Shopware ships no reconnect package. Run `composer require facile-it/doctrine-mysql-come-back` and set the wrapper class in the DSN:

```dotenv
DATABASE_URL="mysql://username:password@localhost:3306/dbname?wrapperClass=Facile\DoctrineMySQLComeBack\Doctrine\DBAL\Connection&driverOptions[x_reconnect_attempts]=3"
```

With replicas, use `Facile\DoctrineMySQLComeBack\Doctrine\DBAL\Connections\PrimaryReadReplicaConnection` instead and keep `DATABASE_REPLICA_0_URL` set. Full variable list: [Environment variables](platform/dev/6.7/guides/hosting/configurations/shopware/environment-variables.md).

## Essential identifiers

- `DATABASE_URL`, `DATABASE_REPLICA_0_URL`
- `DATABASE_SSL_CA`, `DATABASE_SSL_CERT`, `DATABASE_SSL_KEY`, `DATABASE_SSL_DONT_VERIFY_SERVER_CERT`
- `DATABASE_PERSISTENT_CONNECTION`, `DATABASE_PROTOCOL_COMPRESSION`
- `Shopware\Core\Framework\Adapter\Database\MySQLFactory`

## Gotchas

- `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` is silently ignored unless `\Pdo\Mysql::ATTR_SSL_VERIFY_SERVER_CERT` exists (PHP 8.2+, `ext-pdo_mysql`).
- Avoid persistent connections with read replicas (can pin requests to the wrong node) and on web servers with many PHP-FPM children (exhausts `max_connections`).
- The docs suggest `SQL_SET_DEFAULT_SESSION_VARIABLES=0` to skip the session-variable setup; no code in 6.7.15.1 reads it — the init commands always run.
- The docs' first come-back example repeats `?wrapperClass=` twice; use it once.
- The docs' read/write-split link points to a 6.4 `DebugStack` decoration that no longer exists.

## Code check (6.7.15.1)
- corrected `group_concat_max_len` — docs: not set by Shopware / only on read-only servers; set on every connection — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:63
- absent `SQL_SET_DEFAULT_SESSION_VARIABLES` — not read anywhere in the installed code
- absent `DebugStack` — 6.4-era profiling class, no longer in the code
- confirmed `DATABASE_REPLICA_0_URL` — enables primary/replica setup, further replicas by index — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:93
- confirmed `PrimaryReadReplicaConnection` — default wrapperClass unless set in DSN — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:96
- confirmed `DATABASE_SSL_CA` — mapped to `Mysql::ATTR_SSL_CA` — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:69
- confirmed `DATABASE_SSL_KEY` — mapped to `Mysql::ATTR_SSL_KEY` — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:77
- confirmed `DATABASE_SSL_DONT_VERIFY_SERVER_CERT` — applied only if the PDO constant is defined — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:81
- confirmed `DATABASE_PERSISTENT_CONNECTION` — sets `PDO::ATTR_PERSISTENT` — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:85
- confirmed `DATABASE_PROTOCOL_COMPRESSION` — sets `Mysql::ATTR_COMPRESS` — vendor/shopware/core/Framework/Adapter/Database/MySQLFactory.php:89
