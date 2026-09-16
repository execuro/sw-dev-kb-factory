# `dev-68` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `dev-68` · `dev` · `App system` |
| Version | `6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0942-62-71` |
| Core version | `6.7.13.0` |

**Query:** How does the registration handshake between Shopware and my app backend work — shop id, proof, shop secret and the confirmation call?

**Expected answer — every fact an answer must contain:**

1. Registration runs only when the manifest has a `<setup>` block: Shopware sends a `GET` to `<setup><registrationUrl>` with the query parameters `shop-id`, `shop-url` and `timestamp`, carrying the headers `shopware-app-signature` = `hash_hmac('sha256', <raw query string>, <app secret>)` and `sw-version`; on re-registration it additionally carries `shopware-shop-signature`, the same query string signed with the app's current stored secret.  `[code: Framework/App/Lifecycle/Registration/PrivateHandshake.php:31-58]`
2. The app answers with JSON containing `proof`, `secret` and `confirmation_url`; `proof` must be `hash_hmac('sha256', shopId . shopUrl . appName, <app secret>)` — the three values concatenated with no separator — and is compared timing-safe against `trim($proof)`. In 6.7 a returned `secret` identical to the currently stored app secret is rejected. A JSON `error` string aborts the registration with that message.  `[code: Framework/App/Lifecycle/Registration/AppRegistrationService.php:57-62,156-176]`
3. Shopware then `POST`s to `confirmation_url` the body `{apiKey, secretKey, timestamp, shopUrl, shopId}`, signed with `shopware-shop-signature` = HMAC-SHA256 of the JSON body keyed with the **new** secret the app just returned (plus `shopware-shop-signature-previous` signed with the previous secret on re-registration); the new secret is persisted only after that POST succeeds.  `[code: Framework/App/Lifecycle/Registration/AppRegistrationService.php:66-69,124-139,195-213]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-registration-setup.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| Registration is skipped when the manifest has no `<setup>` | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:43-47` | `if (!$manifest->getSetup()) { return; }` |
| Registration runs on install, and on update when the app has no secret yet; a failure removes the app data again | `Framework/App/Lifecycle/AppManager.php:365-376` | `if ((!$app->getAppSecret() \|\| $install) && $manifest->getSetup()) {` |
| Step 1 is a GET with shop-id, shop-url, timestamp | `Framework/App/Lifecycle/Registration/PrivateHandshake.php:31-58` | `$uri = Uri::withQueryValues($uri, ['shop-id' => …, 'shop-url' => …, 'timestamp' => …]); … return new Request('GET', $uri, $headers);` |
| Headers: shopware-app-signature over the query string, sw-version | `Framework/App/Lifecycle/Registration/PrivateHandshake.php:41-46` | `$signature = hash_hmac('sha256', $uri->getQuery(), $this->secret);` |
| Re-registration adds shopware-shop-signature signed with the current stored secret | `Framework/App/Lifecycle/Registration/PrivateHandshake.php:48-52` | `$shopSignature = hash_hmac('sha256', $uri->getQuery(), $this->currentAppSecret);` |
| A manifest `<setup><secret>` selects PrivateHandshake; otherwise StoreHandshake signs through the Shopware store | `Framework/App/Lifecycle/Registration/HandshakeFactory.php:58-80` | `if ($privateSecret) { return new PrivateHandshake(` |
| StoreHandshake builds the identical query and headers; only the signing is delegated | `Framework/App/Lifecycle/Registration/StoreHandshake.php:37-58` | `$signature = $this->signPayload($uri->getQuery());` |
| The response must carry proof, secret, confirmation_url | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:52-55` | `$secret = $appResponse['secret']; $confirmationUrl = $appResponse['confirmation_url'];` |
| The proof is HMAC over shopId . shopUrl . appName | `Framework/App/Lifecycle/Registration/PrivateHandshake.php:61-64` | `return hash_hmac('sha256', $this->shopId . $this->shopUrl . $this->appName, $this->secret);` |
| Proof verification is timing-safe over the trimmed value | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:166-174` | `if (!hash_equals($handshake->fetchAppProof(), trim($proof))) {` |
| 6.7 rejects a returned secret equal to the stored one | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:57-62` | `'The new app secret returned from the App must be different from the current one.'` |
| The confirmation POST body | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:195-204` | `return ['apiKey' => $integration->getAccessKey(), 'secretKey' => $secretAccessKey, 'timestamp' => …, 'shopUrl' => …, 'shopId' => $shopId->id];` |
| The confirmation POST is signed with the NEW secret | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:124-131` | `$signature = $this->signPayload($payload, $secret); … 'shopware-shop-signature' => $signature` |
| Re-registration adds shopware-shop-signature-previous | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:133-139` | `$headers['shopware-shop-signature-previous'] = $previousSignature;` |
| The new secret is saved only after a successful confirmation | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:66-69` | `// After successful confirmation, save the new secret` |
| The shop id is a 16-char random string; 6.7 stores a V2 structure with fingerprints | `Framework/App/ShopId/ShopIdProvider.php:61-71` | `$shopId = ShopId::v2($existingShopId ?? Random::getAlphanumericString(16), $this->fingerprintGenerator->takeFingerprints());` |
| Non-matching fingerprints throw instead of regenerating when an app holds a secret | `Framework/App/ShopId/ShopIdProvider.php:47-56` | `throw AppException::shopIdChangeSuggested($this->shopId, $fingerprintsComparison);` |
| Secret rotation reuses the same registration flow | `Framework/App/Lifecycle/AppSecretRotationService.php:116` | `$this->registrationService->registerApp($manifest, $appId, $newSecret, $context);` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| The registration request is a POST | absent | Both handshakes build `new Request('GET', $uri, $headers)`; the only POST is the confirmation call — `PrivateHandshake.php:54-58`, `StoreHandshake.php:60-64` |
| Shopware enforces a replay window on the registration timestamp | absent | `parseResponse` checks only `error` and `proof`; no timestamp comparison exists — `AppRegistrationService.php:151-177` |
| The confirmation POST is signed with the previous or the setup secret | absent | `signPayload($payload, $secret)` uses the NEW secret; the previous secret only produces the extra `-previous` header — `AppRegistrationService.php:126-139` |
| The shop id is derived from APP_URL | absent | The id is `Random::getAlphanumericString(16)`; APP_URL is only one fingerprint — `ShopIdProvider.php:63-66`, `ShopId.php:38-41` |
| The proof is signed over the query string | absent | `fetchAppProof()` signs `shopId . shopUrl . appName` — `PrivateHandshake.php:41` vs `:63` |
| The shop secret must be 64–255 characters (enforced by Shopware) | absent | No length check exists in the registration path; the code only rejects a secret equal to the stored one — `AppRegistrationService.php:57-62,151-177` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| _None — functional tests are stripped from the dist package._ | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| GHSA-c4p7-rwrg-pf6p / CVE-2026-31889 "Potential take over of app credentials": re-registration could update the shop-url without proving control of the previously registered shop; the fix validates both the app secret and the existing shop secret and forces a new shop secret | affects >=6.7.0.0 <6.7.8.1 and <6.6.10.15; fixed 6.7.8.1 / 6.6.10.15 | closed | https://github.com/shopware/shopware/security/advisories/GHSA-c4p7-rwrg-pf6p |
| Docs describe a `shopware-shop-signature-previous` header the app must validate in addition to the normal signature | 6.7 | open | https://developer.shopware.com/docs/guides/plugins/apps/lifecycle/app-signature-verification.html |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does 6.7 send `shopware-shop-signature-previous` on the re-registration confirmation, and which secret signs it? | code | Yes — `AppRegistrationService.php:133-139`, signed with the previous secret; the primary `shopware-shop-signature` uses the new one. Folded into fact 3. |
| Exact query parameters and proof header on the initial GET | code | shop-id, shop-url, timestamp; `shopware-app-signature` — `PrivateHandshake.php:31-58`. Fact 1. |
| Which JSON fields must the app return and how is the proof verified? | code | proof, secret, confirmation_url; `hash_equals` against `trim($proof)` — `AppRegistrationService.php:156-176`. Fact 2. |
| Exact confirmation POST body and signing secret | code | `{apiKey, secretKey, timestamp, shopUrl, shopId}` signed with the new secret — `AppRegistrationService.php:195-213`. Fact 3. |
| Does re-registration reject a changed shop-url until confirmation succeeds, and is there a grace period? | code, partially | Shopware persists the new secret only after a successful confirmation (`:66-69`); no grace-period constant exists on the Shopware side — the grace period is an app-side recommendation in the docs. Not load-bearing for the three facts. |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The registration request is a GET to `<setup><registrationUrl>` | "The registration request is made via a `GET` request to the URL you provide in your app's manifest file." | `guides/plugins/apps/lifecycle/app-registration-setup.md` | yes — `PrivateHandshake.php:54-58` |
| Query parameters shop-id, shop-url, timestamp | "`shop-id` … `shop-url` … `timestamp`" | same | yes — `PrivateHandshake.php:33-37` |
| Headers shopware-app-signature, sw-version, and shopware-shop-signature on re-registration only | "`shopware-shop-signature`: *(re-registration only)*" | same | yes — `PrivateHandshake.php:41-52` |
| The proof is the SHA-256 HMAC of shopId + shopUrl + app name | "The proof consists of the SHA-256 HMAC of the concatenation of `shopId`, `shopUrl`, and your app's name." | same | yes — `PrivateHandshake.php:61-64` |
| The response contains proof, secret, confirmation_url | example JSON body | same | yes — `AppRegistrationService.php:52-55` |
| The shop-secret must be min 64 / max 255 characters | "have a minimum length of 64 characters, and a maximum length of 255 characters" | same | no — no length validation in the registration path |
| The confirmation POST carries apiKey, secretKey, timestamp, shopUrl, shopId | field list | same | yes — `AppRegistrationService.php:195-204` |
| The confirmation request is signed with the shop-secret the app provided | "The request is signed with the `shop-secret` your app provided in the registration response" | same | yes — the new secret returned by the app, `AppRegistrationService.php:124-131` |
| Re-registration adds `shopware-shop-signature-previous` signed with the previous shop-secret | header description | same | yes — `AppRegistrationService.php:133-139` |
| A `<secret>` in the manifest is for local development / mandatory for private apps with an external app server | "If you are developing a **private app** … you **must** provide the `<secret>`" | same | partially — code only branches on its presence (`HandshakeFactory.php:58-80`); the store-upload rule is policy, not code |
| The new secret should only become effective after a valid confirmation, with an app-side grace period | "your app **should accept the old secret in parallel** … (e.g., 1 minute)" | same | Shopware-side ordering yes (`:66-69`); the grace period is app-side advice, not code |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The shop-secret has a minimum length of 64 and a maximum of 255 characters | Shopware validates no length at all; the only check on the returned secret is that it differs from the currently stored one | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:57-62` |
| `app-signature-verification.md` states outgoing requests are signed "with your app secret", while `app-registration-setup.md` states the per-shop `shop-secret` signs them after registration | One value: the secret the app returns at registration is stored as the app's secret and is what signs subsequent requests | `Framework/App/Hmac/RequestSigner.php:13-46`; `AppRegistrationService.php:66-69` |
| `app-signature-verification.md` shows the GET signature arriving as a `shopware-shop-signature` **query parameter** | Both handshakes put every signature in headers; no signature is ever added as a query parameter | `Framework/App/Lifecycle/Registration/PrivateHandshake.php:41-58` |
| Docs present the timestamp as replay protection Shopware participates in | Shopware sends the timestamp but never validates one; rejecting stale requests is entirely the app's job | `Framework/App/Lifecycle/Registration/AppRegistrationService.php:151-177` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| Shopware sends a `GET` registration request with `shop-id`, `shop-url` and `timestamp`, signed in the `shopware-app-signature` header as an HMAC-SHA256 of the query string with the `app-secret`. | rewritten | Kept and confirmed; extended with the `<setup>` precondition and the re-registration `shopware-shop-signature` header, both of which the code shows are load-bearing in 6.7. |
| The app answers with a `proof` (SHA-256 HMAC of `shopId + shopUrl + appName`, signed with the `app-secret`), a generated `secret` (the `shop-secret`, 64–255 characters) and a `confirmation_url`. | rewritten | Proof and fields confirmed; the "64–255 characters" clause removed — no length validation exists in the code, it is an unconfirmed doc claim. Added the 6.7 rule that the new secret must differ from the stored one. |
| Shopware then `POST`s to `confirmation_url` with `apiKey`, `secretKey`, `timestamp`, `shopUrl` and `shopId`, signed via `shopware-shop-signature` using the `shop-secret`. | rewritten | Confirmed, but sharpened: the signing key is specifically the **new** secret just returned, `shopware-shop-signature-previous` is added on re-registration, and the secret is persisted only after the POST succeeds. |
