# `dev-64` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-64` · `dev` · `Admin API` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** How do I get an Admin API OAuth token — with client_credentials for an integration, or the password grant for local testing — and how long is each token valid?

**Expected answer — every fact an answer must contain:**

1. An integration authenticates with `POST /api/oauth/token`, `grant_type: client_credentials`, `client_id` = the integration's access key ID and `client_secret` = its secret access key; the response is `token_type: Bearer`, `access_token` and `expires_in`, and it contains **no** `refresh_token` — the integration must request a new token when the old one expires.  `[code: Framework/Api/OAuth/ClientRepository.php:39]`
2. The access-token lifetime is `PT10M` — 600 seconds, `expires_in: 600` — and it is the same for every grant, client_credentials included; refresh tokens are issued only by the `password` and `refresh_token` grants and live `P1W` (1 week). Both are configurable via `shopware.api.access_token_ttl` / `shopware.api.refresh_token_ttl`.  `[code: Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47]`
3. For local testing use `grant_type: password` with the literal `client_id: administration` (no `client_secret` — that client is non-confidential) plus the admin `username` / `password`; it returns an access token and a refresh token. It is a local shortcut only; integrations use client_credentials.  `[code: Framework/Api/OAuth/ClientRepository.php:35]` · intent `[docs-only]`

**Official reference URL:** https://developer.shopware.com/docs/guides/development/integrations-api/auth-api-requests.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| The only token endpoint is `POST /api/oauth/token`, `auth_required=false`, delegating to the league AuthorizationServer | `Framework/Api/Controller/AuthController.php:33` | `#[Route(path: '/api/oauth/token', name: 'api.oauth.token', defaults: ['auth_required' => false], methods: ['POST'])]` |
| Four grant types are enabled with the **same** access-token interval: Shopware password, Shopware refresh-token, league ClientCredentialsGrant, SSO ShopwareGrantType | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:83` | `$this->authorizationServer->enableGrantType(new ClientCredentialsGrant(), $accessTokenInterval);` |
| Access-token TTL defaults to `PT10M`, refresh-token TTL to `P1W` | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47` | `private readonly string $accessTokenTtl = 'PT10M',\n private readonly string $refreshTokenTtl = 'P1W'` |
| Both TTLs are bundle configuration with the same defaults | `Framework/DependencyInjection/Configuration.php:203` | `->scalarNode('access_token_ttl')->defaultValue('PT10M')->end()` |
| The parameters are injected into the listener, so the TTL is config-driven | `Framework/DependencyInjection/api.xml:298` | `<argument type="string">%shopware.api.access_token_ttl%</argument>` |
| `setRefreshTokenTTL` is called on the password and refresh-token grants only | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:73` | `$passwordGrant->setRefreshTokenTTL($refreshTokenInterval);` |
| For client_credentials the client_id is the access key and client_secret the secret access key | `Framework/Api/OAuth/ClientRepository.php:39` | `if ($grantType === 'client_credentials' && $clientSecret !== null) { $values = $this->getByAccessKey($clientIdentifier);` |
| For password / refresh_token the client_id must be literally `administration`, and the client is non-confidential | `Framework/Api/OAuth/ClientRepository.php:35` | `if (($grantType === 'password' \|\| $grantType === 'refresh_token') && $clientIdentifier === 'administration') { return true; }` |
| An integration of an inactive app is rejected; a successful call updates `integration.last_usage_at` | `Framework/Api/OAuth/ClientRepository.php:158` | `if ($key['active'] === '0') { return null; }` |
| The password grant always receives `write`; client_credentials receives it only with write access; `user-verified` is stripped for every grant but password; `admin` comes from the user row | `Framework/Api/OAuth/ScopeRepository.php:85` | `if ($grantType === self::PASSWORD_GRANT) { $hasWrite = true; }` |
| Response body is the league BearerTokenResponse: `token_type: Bearer`, `expires_in` in seconds, `access_token`, `refresh_token` only when one was issued | `vendor/league/oauth2-server/src/ResponseTypes/BearerTokenResponse.php:33` | `'token_type' => 'Bearer',\n 'expires_in' => $expireDateTime - time(),` |
| The refresh_token grant **does** return a new refresh token | `vendor/league/oauth2-server/src/Grant/RefreshTokenGrant.php:91` | `$refreshToken = $this->issueRefreshToken($accessToken);` |
| The endpoint is rate limited (`RateLimiter::OAUTH`, plus optional per-user / per-client limits) | `Framework/Api/Controller/AuthController.php:43` | `$this->rateLimiter->ensureAccepted(RateLimiter::OAUTH, $combinedKey);` |
| Shipped oauth policy: `time_backoff`, 10/10s, 15/30s, 20/60s, reset 24 hours | `Framework/Resources/config/packages/shopware.yaml:260` | `policy: 'time_backoff'\n reset: '24 hours'` |
| Tokens are JWTs validated per request by `SymfonyBearerTokenValidator` against `shopware.jwt_config` | `Framework/DependencyInjection/api.xml:267` | `<argument type="service" id="shopware.jwt_config"/>` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| client_credentials returns a `refresh_token` | absent | League's `ClientCredentialsGrant::respondToAccessTokenRequest` issues only an access token; Shopware uses the class unmodified — `vendor/league/oauth2-server/src/Grant/ClientCredentialsGrant.php:50` |
| There is a separate refresh-token lifetime for integrations | absent | `setRefreshTokenTTL` is never called on the ClientCredentialsGrant instance — `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:85` |
| The project overrides the shipped TTLs | absent | No `access_token_ttl` / `refresh_token_ttl` key anywhere under the project's `config/`, so `PT10M` / `P1W` apply |
| A password-grant token can be obtained with a user access key/secret | absent | `validateClient` accepts a user access key only under client_credentials — `Framework/Api/OAuth/ClientRepository.php:109` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| The password-grant payload used for local/test auth: `grant_type`, `client_id: administration`, `username`, `password` — no `scope`/`scopes` key at all | `Framework/Test/TestCaseBase/AdminApiTestBehaviour.php:172` |
| The client_credentials payload for an integration; unlike the password helper it asserts no `refresh_token` | `Framework/Test/TestCaseBase/AdminApiTestBehaviour.php:243` |
| Default scopes of a password-grant token for an admin user are exactly `['admin','write']` | upstream trunk `tests/integration/Core/Framework/Api/Controller/AuthControllerTest.php` @ `ee66a4c` |
| Refreshing returns a new refresh token and the old one is single-use (400 `Token has been revoked`) | same file @ `ee66a4c` |
| `user-verified` is dropped when refreshing | same file @ `ee66a4c` |
| Wrong integration secret → 401; unknown grant_type → 400; integration of an inactive app → 401 | same file @ `ee66a4c` |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `scopes=user-verified` silently yields `["write","admin"]`; only `scope=…` grants the scope | 6.6.10.5 | closed | https://github.com/shopware/shopware/issues/12428 |
| Access tokens carry `expires_in: 600`; refresh-token rotation revokes the old token immediately, causing 401s on concurrent refreshes | 6.5–6.7 / trunk (per reporter) | closed | https://github.com/shopware/shopware/issues/13130 |
| Token renewed every 10 minutes; reporter is inconsistent about which TTL is which | 6.5.8.4 | closed | https://github.com/shopware/shopware/issues/3572 |
| Historic: client_credentials rejected while documented | pre-6.4 | closed | https://github.com/shopware/shopware/issues/549 |
| Historic: 6.4 OAuth upgrade broke `/api/oauth/token` | 6.4.0.0 | closed | https://github.com/shopware/shopware/issues/1846 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Access-token TTL for client_credentials vs password in 6.7 | `ApiAuthenticationListener.php:83` | Identical — one `$accessTokenInterval` is passed to all four grants |
| Is the TTL configurable or hardcoded? | `Configuration.php:203`, `api.xml:298` | Configurable: `shopware.api.access_token_ttl` / `refresh_token_ttl`, defaults `PT10M` / `P1W` |
| Does client_credentials issue a refresh token? | league `ClientCredentialsGrant.php:50` | No |
| Is the refresh token single-use (rotation)? | league `RefreshTokenGrant.php:91` + upstream `AuthControllerTest` | Yes — a new refresh token is issued and reusing the old one yields 400 `Token has been revoked` |
| Does 6.7 still use `administration` for the password grant, and is a secret needed? | `ClientRepository.php:35` | Yes; no client_secret — the client is non-confidential |
| Which parameter name carries scopes, `scope` or `scopes`? | not settled by the code lane | Not material to any fact: `ScopeRepository.php:85` grants `write` to the password grant unconditionally, and the upstream test payload sends no scope key at all. The old fact's `scopes: write` fragment was removed for that reason, not because a value was verified |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| Admin API authenticates via OAuth with integration credentials | "The Admin API uses OAuth with integration credentials." | `integrations-api/index.md` | yes |
| Access key ID → `client_id`, Secret access key → `client_secret` | "**Access key ID**: maps to the OAuth field `client_id`" | `integrations-api/index.md` | yes — `ClientRepository.php:39` |
| Token requested by POSTing `grant_type/client_id/client_secret` to `/api/oauth/token` | curl example | `integrations-api/index.md` | yes — `AuthController.php:33` |
| client_credentials response has `expires_in: 3600` and no refresh_token | `{"token_type":"Bearer","expires_in":3600,…}` | `integrations-api/index.md` | **no** for 3600; yes for the absent refresh_token |
| Password grant for local development only, `client_id: administration`, `scopes: write` | "For local development only, you can also obtain an Admin API token…" | `integrations-api/auth-api-requests.md` | partly — grant, client_id and local-only intent yes; the `scopes` key is not read by any code path the lane examined |
| Password-grant response has `expires_in: 600` plus a refresh_token | `{"expires_in":600,…,"refresh_token":"…"}` | `integrations-api/auth-api-requests.md` | yes |
| Tokens expire, default 10 minutes | "Tokens expire (default: 10 minutes)" | `products/tools/mcp-server/getting-started.md` | yes — `PT10M` |
| Integrations should prefer client_credentials; password is a local shortcut | "Use this only as a local shortcut." | `integrations-api/auth-api-requests.md` | intent, admitted as `[docs-only]` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| A client_credentials token lasts `expires_in: 3600` | Every grant gets the same `PT10M` interval — 600 seconds. The `3600` example is wrong for a stock installation | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47` and `:83` |
| The official pages state the lifetime three ways (3600 / 600 / "default 10 minutes") and none authoritatively | One value governs all grants: `PT10M`, configurable via `shopware.api.access_token_ttl` | `Framework/DependencyInjection/Configuration.php:203` |
| Core's own shipped OpenAPI says `refresh_token` "is not returned on grant type `refresh_token`" | The refresh_token grant does issue and return a new refresh token | `vendor/league/oauth2-server/src/Grant/RefreshTokenGrant.php:91` vs `Framework/Api/ApiDefinition/Generator/Schema/AdminApi/paths/token.json:55` |
| The password-grant example sends `scopes: write` | The password grant receives `write` unconditionally; the upstream test payload sends no scope key. Community #12428 reports `scopes` is ignored in favour of `scope`, which the code lane did not confirm either way | `Framework/Api/OAuth/ScopeRepository.php:85` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| `The local-only password grant is POST /api/oauth/token with grant_type: password, client_id: administration, scopes: write, username admin / password shopware.` | rewritten | Grant, endpoint and `client_id: administration` confirmed (`ClientRepository.php:35`); the `scopes: write` fragment removed — `ScopeRepository.php:85` grants `write` to the password grant regardless of any requested scope and the upstream test payload omits the key. Added the code-shown point that no `client_secret` is required |
| `A password-grant token expires after expires_in: 600, while a client_credentials token lasts 3600.` | removed | Code disproves the per-grant difference: one `$accessTokenInterval` (`PT10M` = 600 s) is passed to all four grants, client_credentials included (`ApiAuthenticationListener.php:47`, `:83`) |
| `Integrations and reproducible setups must use client_credentials; the password grant is a local development shortcut only.` | kept, folded into fact 3 | Intent the code cannot express; no code contradiction. Retained as `[docs-only]` |
| — | added (fact 1) | client_credentials issues **no** refresh token — an integration must re-authenticate. Load-bearing for the query's "how long is each token valid" and missed by the old set (league `ClientCredentialsGrant.php:50`) |
