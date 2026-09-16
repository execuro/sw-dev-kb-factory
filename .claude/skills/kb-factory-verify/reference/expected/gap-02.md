# `gap-02` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-02` · `gap` · `Gap` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** Shopware 6.7 removed the RSA JWT key files and `system:generate-jwt-secret` — what signs Admin API tokens now, and what do I have to do when upgrading?

**Expected answer — every fact an answer must contain:**

1. States that the documentation corpus does not answer this: it carries no release-notes section and no 6.7 upgrade page, and its only JWT material is pre-6.7 — the deployer guide that still copies `config/jwt` into the shared directory, and the CLI helper page that calls JWT key generation "required only for Shopware versions before 6.5".  `[docs-only]`
2. Names those pages as the closest material read and flags them as stale rather than presenting `config/jwt` or `generate-jwt` as current; notes that the commands reference lists `system:generate-app-secret` and no longer lists `system:generate-jwt-secret`.  `[docs-only]`
3. If it states what signs tokens now, states it correctly: HMAC-SHA256 over the `APP_SECRET` environment variable, with no key file read at any point — the OAuth server is handed a `FakeCryptKey` whose key contents and key path are empty strings. `system:generate-jwt-secret` and `JwtCertificateGenerator` do not exist in 6.7. It invents no upgrade procedure, key path, config node or secret-length rule beyond that.  `[code: Framework/Api/OAuth/JWTConfigurationFactory.php:20-36]`

**Official reference URL:** https://github.com/shopware/shopware/blob/trunk/UPGRADE-6.7.md#removal-of-rsa-jwt-secrets
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Tokens are signed symmetrically with HMAC-SHA256 keyed by `APP_SECRET` | `Framework/Api/OAuth/JWTConfigurationFactory.php:20-36` | `$secret = (string) EnvironmentHelper::getVariable('APP_SECRET');` … `Configuration::forSymmetricSigner(new Hmac256(), $key)` |
| The same configuration is the validation side; only `SignedWith(Hmac256)` and `LooseValidAt` are installed | `Framework/Api/OAuth/JWTConfigurationFactory.php:33-36` | `new SignedWith(new Hmac256(), $key), new LooseValidAt($clock, null),` |
| Wired as the `shopware.jwt_config` service | `Framework/DependencyInjection/api.xml:245-248` | `<service id="shopware.jwt_config" class="Lcobucci\JWT\Configuration">` |
| The League `AuthorizationServer` gets a `FakeCryptKey` plus `%env(APP_SECRET)%` — the private.pem contract is stubbed out | `Framework/DependencyInjection/api.xml:252-262` | `<argument type="service" id="Shopware\Core\Framework\Api\OAuth\FakeCryptKey"/>` / `<argument>%env(APP_SECRET)%</argument>` |
| `FakeCryptKey` returns empty key contents and empty key path — no PEM is ever loaded | `Framework/Api/OAuth/FakeCryptKey.php:24-32` | `public function getKeyContents(): string { return ''; }` |
| Bearer validation asserts the HMAC constraints; failure is `accessDenied('Access token could not be verified')` | `Framework/Api/OAuth/SymfonyBearerTokenValidator.php:53-60` | `$this->jwtConfiguration->validator()->assert($token, ...$constraints);` |
| Issuing never falls back to RSA — `AccessToken` rebuilds the HMAC config if the key is not already a `FakeCryptKey` | `Framework/Api/OAuth/AccessToken.php:80-87` | `if (!$this->privateKey instanceof FakeCryptKey) { … new FakeCryptKey($jwtConfig); }` |
| `APP_SECRET` is generated at setup time, so an installed shop already has one | `Maintenance/System/Command/SystemSetupCommand.php:138` | `$env['APP_SECRET'] = Random::getString(SystemGenerateAppSecretCommand::APP_SECRET_LENGTH);` |
| In 6.6 the command existed and was already flagged for removal without replacement | `github.com/shopware/shopware@v6.6.10.0 src/Core/Maintenance/System/Command/SystemGenerateJwtSecretCommand.php` | `@deprecated tag:v6.7.0 - reason:remove-command - will be removed without a replacement` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| `bin/console system:generate-jwt-secret` still exists in 6.7 | absent | `Maintenance/System/Command/` holds only the ConfigureShop / GenerateAppSecret / Install / IsInstalled / Setup / UpdateFinish / UpdatePrepare commands; grep for `generate-jwt\|GenerateJwt` across `vendor/shopware/{core,storefront,administration}` returns nothing. |
| `JwtCertificateGenerator` still ships | absent | No such file in `vendor/shopware/core` at 6.7.13.0; the class is referenced only by the 6.6 command fetched from GitHub. |
| The `shopware.api.jwt_key` config node (private_key_path / public_key_path / use_app_secret) is still configurable | absent | No `jwt` occurrence in `Framework/DependencyInjection/Configuration.php` or `Framework/Resources/config/`; the project has no `config/jwt` directory. |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None found._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| Maintainer PR adding the missing UPGRADE-6.7 entry for the JWT removal ("We missed the upgrade guide info for the break") | 6.7.0.0 | merged | github.com/shopware/shopware/pull/8185 |
| Backport carrying the same upgrade-guide wording | 6.7.0.0 | merged | github.com/shopware/shopware/pull/8181 |
| Hosting writeups report `system:generate-jwt-secret` missing after upgrade; deploy pipelines calling it break | 6.7 | open | notebook.vanwittlaer.de/hosting/jwt-secrets-as-environment-variables/ |
| HMAC-over-APP_SECRET existed as an opt-in in 6.6.1.0 before becoming the only mode | 6.6.1.0 | closed | developer.shopware.com/release-notes/6.6/6.6.1.0.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Which class builds the signing key in 6.7, and is `APP_SECRET` the only source? | code | `JWTConfigurationFactory::createJWTConfiguration()` reads only `APP_SECRET` (`JWTConfigurationFactory.php:20-36`). |
| Is the algorithm HMAC, or is RSA still a fallback? | code | HMAC-SHA256 only; `AccessToken::initJwtConfiguration` prevents any RSA fallback. |
| Does `system:generate-jwt-secret` really no longer exist? | code | Absent from `Maintenance/System/Command/`; no grep hit anywhere in the vendored packages. |
| Does the `shopware.api.jwt_key.*` config node still exist? | code | Absent from the bundle Configuration class. |
| Is there a minimum APP_SECRET length (community claims ≥ 32 chars)? | not settled | Not found in the code lane's reading; deliberately **not** stated as a fact. |
| Does changing APP_SECRET invalidate refresh tokens too? | not settled | Code lane could not trace it; no fact asserts anything about it. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The 6.7.0.0 release notes list the removal as a bare bullet with no replacement stated on that page | "Removal of RSA JWT secrets" | live release-notes/6.7/6.7.0.0.html (Hosting & Configuration) | yes — the removal is real; the replacement is APP_SECRET/HMAC |
| The 6.6.1.0 release notes deprecate asymmetric JWT | "Using private/public keys (asymmetric encryption) for JWT is now deprecated and will be removed with the next major release." | live release-notes/6.6/6.6.1.0.html | yes |
| The 6.6.1.0 release notes name HMAC over the existing APP_SECRET as the replacement | *unverified quote — `quoteFidelity`: reconstructed from a WebFetch summary, not an uninterrupted verbatim sentence* | live release-notes/6.6/6.6.1.0.html | not admitted as evidence; the code finding stands on its own |
| The commands reference lists `system:generate-app-secret` and not `system:generate-jwt-secret` | "\| `system:generate-app-secret` \| Generates a new app secret \|" | `resources/references/core-reference/commands-reference.md:388` | yes |
| The CLI helper page calls JWT key generation "required only for Shopware versions before 6.5" | "Required only for Shopware versions before 6.5; in 6.5+, JWT secrets are generated automatically." | `products/tools/cli/project-commands/helper-commands.md:226` | contradicted — no JWT secrets are generated at all in 6.7 |
| The deployer guide still shares `config/jwt` across releases | `cp -R /var/www/shopware_backup/config/jwt /var/www/shopware/shared/config` | `guides/hosting/installation-updates/deployments/deployment-with-deployer.md:196` | contradicted — no PEM is ever read |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The deployer hosting guide instructs operators to copy and share `config/jwt` between releases | No key file is loaded anywhere; `FakeCryptKey` returns an empty key path | `Framework/Api/OAuth/FakeCryptKey.php:24-32` |
| The CLI helper page presents `config/jwt/` key generation as needed only before 6.5 and auto-generated in 6.5+ | 6.7 generates no JWT keys; signing is HMAC over `APP_SECRET`, and `JwtCertificateGenerator` no longer ships | `Framework/Api/OAuth/JWTConfigurationFactory.php:20-36` |
| The corpus (clone) contains no release notes and no 6.7 upgrade page at all | The breaking change is real and fully visible in the source | `Maintenance/System/Command/` (command absent) |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the 6.7 change to JWT signing is not documented in the source (nothing found for the removed command or the RSA key removal). | rewritten | Overstated: the commands reference does list `system:generate-app-secret`, and stale JWT pages do exist. The fact now names what the corpus actually contains. |
| Names the closest page actually read (the environment-variables page and its `APP_SECRET` / `openssl rand -hex 32` line, or the CLI helper page that still describes `config/jwt/` keys as pre-6.5). | rewritten | The docs lane found no environment-variables page with that line; naming it would reward an invented citation. Replaced with the pages the lane actually read. |
| Invents no upgrade procedure, key path or command beyond what the read pages state. | rewritten | Kept as a prohibition but anchored to the code-decided answer, so a correct statement of HMAC/APP_SECRET is rewarded and an invented `config/jwt` procedure is not. |
