# `gap-03` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-03` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** My ERP integration stopped logging in after the 6.7 upgrade — what changed in the Admin API OAuth flow (`/api/oauth/authorize`, the `scope` format)?

**Expected answer — every fact an answer must contain:**

1. States that the documentation corpus does not cover the 6.7 OAuth change: `oauth/authorize` occurs nowhere in it, and no guide, concept or upgrade page mentions the removal or a changed scope format. It documents only the token request itself (`POST /api/oauth/token`, `client_credentials` / `password` grants).  `[docs-only]`
2. Names the auth guide actually read (`guides/development/integrations-api/auth-api-requests.md`) and flags its `"scopes": "write"` request body as not what a 6.7 server reads: scopes travel in a single space-delimited `scope` parameter, so a plural `scopes` key is ignored and the default scope is issued.  `[code: vendor/league/oauth2-server/src/Grant/AbstractGrant.php:65,289]`
3. States that `/api/oauth/authorize` no longer exists in 6.7 — `AuthController` declares only `POST /api/oauth/token` (in 6.6 the authorize endpoint was already a deprecated no-op) — while the scope identifiers themselves (`write`, `admin`, `user-verified`) are unchanged between 6.6 and 6.7. It invents no new endpoint, parameter or error message.  `[code: Framework/Api/Controller/AuthController.php:33]`

**Official reference URL:** https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#non-spec-compliant-apioauthtoken-requests-are-not-supported-anymore
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `AuthController` declares exactly one route in 6.7 | `Framework/Api/Controller/AuthController.php:33` | `#[Route(path: '/api/oauth/token', name: 'api.oauth.token', defaults: ['auth_required' => false], methods: ['POST'])]` |
| In 6.6 the authorize endpoint was already a deprecated no-op flagged for removal in 6.7 | `github.com/shopware/shopware@v6.6.10.0 src/Core/Framework/Api/Controller/AuthController.php` | `@deprecated tag:v6.7.0 - Remove endpoint "/api/oauth/authorize"` |
| Enabled grants are password, refresh_token, client_credentials and the SSO `shopware` grant — no authorization_code, hence no /authorize | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:83-86` | `$this->authorizationServer->enableGrantType($passwordGrant, $accessTokenInterval);` … |
| Default TTLs: access `PT10M`, refresh `P1W` | `…/ApiAuthenticationListener.php:47-48` | `private readonly string $accessTokenTtl = 'PT10M',` |
| Scope identifiers are unchanged; each serialises to its bare identifier string | `Framework/Api/OAuth/Scope/WriteScope.php:11-23` | `final public const IDENTIFIER = 'write';` |
| Scope is transmitted as a space-delimited `scope` parameter, split by league/oauth2-server (9.4.1, required as ^9.3) | `vendor/league/oauth2-server/src/Grant/AbstractGrant.php:65,289` | `protected const SCOPE_DELIMITER_STRING = ' ';` … `explode(self::SCOPE_DELIMITER_STRING, trim($scopes))` |
| Behavioural change: 6.7 keeps the write scope on a refresh_token grant where 6.6 stripped it | `Framework/Api/OAuth/ScopeRepository.php:95-101` | `if (!$hasWrite && $grantType !== self::REFRESH_TOKEN_GRANT) { … }` |
| `ScopeRepository` signatures are now natively typed and `finalizeScopes` gained a fifth `?string $authCodeId` — 6.6 decorators are incompatible | `Framework/Api/OAuth/ScopeRepository.php:66-72` | `public function finalizeScopes(array $scopes, string $grantType, ClientEntityInterface $clientEntity, ?string $userIdentifier = null, ?string $authCodeId = null): array` |
| Scopes ride in a non-standard `scopes` JWT claim, read back into the `oauth_scopes` request attribute | `vendor/league/oauth2-server/src/Entities/Traits/AccessTokenTrait.php:74`; `Framework/Api/OAuth/SymfonyBearerTokenValidator.php:77` | `->withClaim('scopes', $this->getScopes())` |
| client_credentials requires a non-null client secret; any other grant is `unsupportedGrantType()` | `Framework/Api/OAuth/ClientRepository.php:33-62` | `if ($grantType === 'client_credentials' && $clientSecret !== null) {` |
| An integration whose linked app is inactive gets no client entity, regardless of credentials | `Framework/Api/OAuth/ClientRepository.php:154-158` | `if ($key['active'] === '0') { return null; }` |
| The token endpoint now applies three rate limiters where 6.6 applied one | `Framework/Api/Controller/AuthController.php:41-48` | `$this->rateLimiter->ensureAcceptedIfConfigured(RateLimiter::OAUTH_CLIENT, $clientIpKey);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `/api/oauth/authorize` exists in 6.7 | absent | grep for `oauth/authorize` across `vendor/shopware/{core,storefront,administration}` returns nothing; `AuthController` defines only `api.oauth.token`. |
| The scope *string format* changed in 6.7 (prefixes, comma separation) | absent | Identifiers are the same literals as in 6.6 and parsing is still league's space-delimited default; Shopware overrides neither `validateScopes` nor the delimiter. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None found._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Reproduced with curl: `scopes=user-verified` silently yields write+admin; only singular `scope` is honoured | 6.6.10.5 | closed | github.com/shopware/shopware/issues/12428 |
| The published OpenAPI schema declared the parameter as `scopes` (required) while the server reads `scope` | trunk / all | closed | github.com/shopware/shopware/issues/14570 |
| shopware/frontends AdminApiClient could not apply any non-default scope for the same reason | unclear | closed | github.com/shopware/frontends/issues/1728 |
| 6.7.0.0 release notes list the `/api/oauth/authorize` removal and the space-delimited `scope` requirement | 6.7.0.0 | closed | developer.shopware.com/release-notes/6.7/6.7.0.0.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `AuthController::authorize` still exist in 6.7? | code | No — only `api.oauth.token` is declared (`AuthController.php:33`). |
| Which parameter does the token endpoint read, `scope` or `scopes`? | code | `scope`, split on a space by league's `AbstractGrant` (`AbstractGrant.php:65,289`); Shopware does not normalise `scopes`. |
| Is `user-verified` still a registered scope in 6.7? | code | Yes — the identifiers `write`, `admin`, `user-verified` are unchanged. |
| Did the league upgrade change TTLs or the integration `client_id` handling? | code | TTLs are `PT10M` / `P1W`; client_credentials now requires a non-null client secret. |
| Which of the three candidate causes actually broke this ERP integration? | not settled | Not determinable from source; the facts therefore assert the changes, not the diagnosis. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| 6.7.0.0 release notes: non spec-compliant `/api/oauth/token` requests unsupported; scopes as a space-delimited `scope` parameter | "Especially scopes now needed to be provided as `scope` parameter and as a space-delimited list of strings." | live release-notes/6.7/6.7.0.0.html | yes — `AbstractGrant.php:65,289` |
| 6.7.0.0 release notes: `/api/oauth/authorize` and `AuthController::authorize` removed without replacement | "Removed API route `/api/oauth/authorize` … without replacement." | live release-notes/6.7/6.7.0.0.html | yes — absent from the source |
| The cloned auth guide still shows a password-grant body with the plural `"scopes": "write"` | `"scopes": "write",` | `guides/development/integrations-api/auth-api-requests.md:22-26` | contradicted — the server reads `scope` |
| Integration Access key ID / Secret access key map to `client_id` / `client_secret` | "**Access key ID**: maps to the OAuth field `client_id`" | `guides/development/integrations-api/index.md:84-85` | yes — `ClientRepository.php:33-62` |
| The client_credentials example shows `expires_in: 3600`; the password example shows 600 | `"expires_in": 3600,` | `guides/development/integrations-api/index.md:101-107` | contradicted — the default access-token TTL is `PT10M` (600s) |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The auth guide's token request body uses `"scopes": "write"` | Only a space-delimited `scope` parameter is read; a plural key is ignored and the default scope is issued | `vendor/league/oauth2-server/src/Grant/AbstractGrant.php:65,289` |
| No page in the corpus mentions `/api/oauth/authorize` at all, before or after removal | The route existed in 6.6 as a deprecated no-op and is gone in 6.7 | `Framework/Api/Controller/AuthController.php:33` |
| The integrations guide advertises `expires_in: 3600` for client_credentials | The listener's default access-token TTL is `PT10M` | `Framework/Api/EventListener/Authentication/ApiAuthenticationListener.php:47-48` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source documents the token request (`POST /api/oauth/token`, `client_credentials` / `password` grants) but nothing about 6.7 changes — no mention of `/api/oauth/authorize` being removed or of a changed `scope` format. | rewritten | Kept in substance, restated as the docs lane established it (`oauth/authorize` occurs nowhere in the corpus). |
| Names the page actually read and reports its example as the only available shape (an answer that flags the plural `scopes` example as suspicious for 6.7 is the best answer, not required). | rewritten | Tolerance clause removed. Code shows the plural `scopes` key is not what the server reads, so reporting the stale example as usable is a wrong answer, not a weaker one. |
| Invents no new endpoint, parameter or error message. | rewritten | Replaced by the positive code-settled statement (authorize removed, identifiers unchanged), with the prohibition retained as its tail. |
