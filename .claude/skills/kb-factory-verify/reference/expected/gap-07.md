# `gap-07` — expected answer

<!-- expected:start -->
| | |
| --- | --- |
| Case | `gap-07` · `gap` · `Gap` |
| Version | `6.6 + 6.7` |
| Status | **confirmed** — verified against shopware/core 6.7.13.0 (6.6 half cross-checked against shopware/shopware v6.6.10.0) |
| Reviewed | `2026-09-12` · run `cases-review-2026-09-12-0959-92-100` |
| Core version | `6.7.13.0` |

**Query:** How do I create a media entity from a file on disk in PHP from my plugin (e.g. during an import) and generate its thumbnails?

**Expected answer — every fact an answer must contain:**

1. States that the corpus has no guide for creating a media entity or persisting a file from PHP: the media plugin section documents only preventing deletion, adding a file extension and remote thumbnail generation; the rest is the display side (`searchMedia`, thumbnails in Twig) and the `media:generate-thumbnails` CLI command. `MediaService` appears nowhere in the developer docs.  `[docs-only]`
2. Does not present a PHP write path as documented. If it names one, it must match the code, which is identical in 6.6 and 6.7: `MediaService::saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string`, where `MediaFile`'s first constructor argument is the absolute source path on disk (no factory exists) and `$private` defaults to `true`.  `[code: Content/Media/MediaService.php:53-68]`
3. Does not claim thumbnails exist as soon as the file is saved: persisting the file dispatches a `GenerateThumbnailsMessage` on the message bus, so thumbnails appear only after a consumer runs (or via `bin/console media:generate-thumbnails`), and nothing is generated at all when the media has no folder whose configuration has `createThumbnails` and thumbnail sizes.  `[code: Content/Media/File/FileSaver.php:94-96]`

**Official reference URL:** https://developer.shopware.com/docs/guides/plugins/plugins/storefront/howto/use-media-thumbnails.html
<!-- expected:end -->

## Evidence — code (decisive)

| fact | citation | excerpt |
| --- | --- | --- |
| `MediaService::saveMediaFile()` creates the media row when no id is given and persists the file, returning the media id | `Content/Media/MediaService.php:53-68` | `if (!$mediaId) { $mediaId = $this->createMediaInFolder($folder ?? '', $context, $private); } $this->fileSaver->persistFileToMedia(...)` |
| `$private` defaults to `true` — media lands on the private filesystem unless `false` is passed | `Content/Media/MediaService.php:36-51` | `public function createMediaInFolder(string $folder, Context $context, bool $private = true): string` |
| `$folder` is matched against `media_folder.defaultFolder.entity` (an entity name such as `product`), not a folder name or id | `Content/Media/MediaService.php:136-144` | `$criteria->addFilter(new EqualsFilter('media_folder.defaultFolder.entity', $folder));` |
| `MediaFile`'s first argument is the source path — `FileSaver` does `fopen()` on it | `Content/Media/File/FileSaver.php:215-220` | `$stream = fopen($mediaFile->getFileName(), 'r');` |
| `MediaFile` is a plain readonly value object with no named constructor | `Content/Media/File/MediaFile.php:10-17` | `__construct(private readonly string $fileName, private readonly string $mimeType, private readonly string $fileExtension, private readonly int $fileSize, private readonly ?string $hash = null)` |
| Thumbnail generation is asynchronous — a `GenerateThumbnailsMessage` is dispatched after the file is written | `Content/Media/File/FileSaver.php:94-96`, `Content/Media/Upload/MediaFileCleanupService.php:57-68` | `$this->cleanup->dispatchThumbnailGeneration($mediaId, $context);` … `$this->messageBus->dispatch($message);` |
| 6.6 dispatches the same message inline in `FileSaver::persistFileToMedia`; signature and observable behaviour are identical | `github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/Media/File/FileSaver.php` | `$message = new GenerateThumbnailsMessage(); … $this->messageBus->dispatch($message);` |
| `MediaService`'s public API is byte-for-byte the same in 6.6 and 6.7 | `github.com/shopware/shopware/blob/v6.6.10.0/src/Core/Content/Media/MediaService.php:49-64` | `public function saveMediaFile(MediaFile $mediaFile, string $filename, Context $context, ?string $folder = null, ?string $mediaId = null, bool $private = true): string` |
| The handler loads `mediaFolder.configuration.mediaThumbnailSizes` and calls `ThumbnailService::generate()` | `Content/Media/Message/GenerateThumbnailsHandler.php:42-60` | `$criteria->addAssociation('mediaFolder.configuration.mediaThumbnailSizes');` |
| Generation is gated on four silent conditions (has file, not external URL, image type that is not vector/animated/icon, folder config with `createThumbnails`) | `Content/Media/Thumbnail/ThumbnailService.php:442-470` | `return $media->getMediaFolder()->getConfiguration()->getCreateThumbnails();` |
| When the gate fails, `generate()` DELETES existing thumbnails rather than skipping | `Content/Media/Thumbnail/ThumbnailService.php:84-88` | `$delete = [...$delete, ...$media->getThumbnails()->getIds()];` |
| Generation failures are logged, not thrown — an import looks successful with no thumbnails | `Content/Media/Thumbnail/ThumbnailService.php:122-129` | `$this->logger->error('Thumbnail generation failed for media {mediaId}', …);` |
| The extension is validated against an allow-list before the write (6.7: `MediaFileExtensionValidator`; 6.6: `FileSaver::validateFileExtension()`) | `Content/Media/Upload/MediaFileExtensionValidator.php:24-35` | `throw MediaException::fileExtensionNotSupported($mediaId, $fileExtension);` |
| Duplicate file names are rejected | `Content/Media/File/FileSaver.php:66-73` | `$this->ensureFileNameIsUnique($currentMedia, $destination, $mediaFile->getFileExtension(), $context);` |
| Services are injectable by FQCN id | `Content/DependencyInjection/media.xml:302-308` | `<service id="Shopware\Core\Content\Media\MediaService">` |

Absences — things the code shows do **not** exist:

| claim checked | verdict | evidence |
| --- | --- | --- |
| A helper that builds a `MediaFile` from a path on disk (e.g. `MediaFile::fromPath()`) | absent | Only the four/five-argument constructor; `FileFetcher` offers `fetchBlob()`, `fetchFileFromURL()`, `fetchRequestData()`, none taking a local path — `Content/Media/File/MediaFile.php` |
| `ThumbnailService::generate()` accepts a media id | absent | It takes a `MediaCollection` whose entities must already have the `thumbnails` association loaded, else `MediaException::thumbnailAssociationNotLoaded` — `Content/Media/Thumbnail/ThumbnailService.php:73-76` |
| Thumbnails are available immediately after `saveMediaFile()` returns | absent | Generation goes through the message bus; nothing in `persistFileToMedia` generates inline — `Content/Media/Upload/MediaFileCleanupService.php:63-67` |

Test anchors, where found:

| what it shows | citation |
| --- | --- |
| none — the dist package strips `Content/Test` | — |

## Evidence — community (escalation only, never decisive)

| signal | version | state | source |
| --- | --- | --- | --- |
| `saveMediaFile(folder: $mediaFolderId)` silently ignores a folder UUID; the argument is a default-folder entity name | 6.6.2.0 | closed (won't-fix, NEXT-37782) | https://github.com/shopware/shopware/issues/4518 |
| Thumbnail generation produced none on trunk; `mediaThumbnailSizeId` becomes required on thumbnail rows (announced for 6.8) | 6.7 (milestone 6.7.2.0) | closed | https://github.com/shopware/shopware/issues/11632 |
| Follow-up: third-party thumbnail processor had to adapt; closed not_planned | 6.7 | closed | https://github.com/shopware/shopware/issues/11760 |
| `media:generate-thumbnails` skips media whose thumbnail rows exist but failed to generate; no `--force` | 6.x | closed | https://github.com/shopware/shopware/issues/6134 |
| `file_extension` null and unsettable for remote-path media | 6.6.4.0+ | closed | https://github.com/shopware/shopware/issues/7993 |

Escalations raised, and how each was settled:

| question | settled by | outcome |
| --- | --- | --- |
| Does `createMediaInFolder($folder)` still resolve a default-folder entity name rather than a folder id in 6.7? | code | Yes — `EqualsFilter('media_folder.defaultFolder.entity', $folder)`; issue #4518's complaint still holds. Folded into fact 2 |
| Exact 6.7 signature of `saveMediaFile()` / `persistFileToMedia()`? | code | `MediaService.php:53-68`; identical in v6.6.10.0 |
| Does `persistFileToMedia()` trigger thumbnails automatically, sync or queued? | code | Queued — `GenerateThumbnailsMessage` on the message bus in both 6.6 and 6.7. Fact 3 |
| Is there a helper that builds a `MediaFile` from a disk path? | code | No — constructor only. Fact 2 |
| Is `mediaThumbnailSizeId` required on `MediaThumbnailDefinition` in 6.7? | not settled | The code lane did not read `MediaThumbnailDefinition`. Not load-bearing: no fact tells an answer to write `media_thumbnail` rows directly |

## Evidence — documentation (claims)

| claim | quote | citation | confirmed by code? |
| --- | --- | --- | --- |
| The media plugin section lists exactly three guides (prevent deletion, custom file extension, remote thumbnail generation) | "* [Prevent Deletion of Media Files Referenced in your Plugins]… * [Add Custom Media File Extension]… * [Remote Thumbnail Generation]…" | `guides/plugins/plugins/content/media/index.md` | n/a — corpus inventory |
| The storefront how-to covers displaying existing media via `searchMedia`, not creating it | "It is not possible to display such an image in the Storefront with only its media ID though. To achieve that, the function `searchMedia` exists:" | `guides/plugins/plugins/storefront/howto/use-media-thumbnails.md` | n/a — display side |
| Uploads normally dispatch a `GenerateThumbnailsMessage` via `FileSaver`; with remote thumbnails on they do not | "**`FileSaver`** — uploads no longer dispatch a `GenerateThumbnailsMessage`…" | `guides/plugins/plugins/content/media/remote-thumbnail-generation.md` | yes — `Content/Media/File/FileSaver.php:94-96`, no-op when remote thumbnails are enabled |
| `ThumbnailService::generate()/updateThumbnails()/deleteThumbnails()` throw `MediaException::thumbnailGenerationDisabled()` when remote thumbnails are on | "Guard custom code that calls these methods." | same page | yes — `Content/Media/Thumbnail/ThumbnailService.php:62-76` |
| `media:generate-thumbnails` generates thumbnails for all media entities | "\| `media:generate-thumbnails` \| Generates the thumbnails for all media entities" | `resources/references/core-reference/commands-reference.md` | command exists — `Content/Media/Commands/GenerateThumbnailsCommand.php:26-27` |
| The Migration Assistant's `LocalMediaProcessor` copies local files into media storage | "For local migrations, `LocalMediaProcessor` resolves local file paths and copies files into Shopware media storage." | `products/extensions/migration-assistant/concept/media-processing.md` | out of scope — a plugin's own abstraction, not core |

Docs coverage verdict: **not-covered**. No page in the developer clone or on the live developer docs shows `MediaService::saveFile`, `FileSaver::persistFileToMedia`, constructing a `MediaFile`, or resolving a default media folder from PHP.

Business context code cannot express:

| point | quote | citation |
| --- | --- | --- |
| Thumbnail sizes are a per-folder merchant setting — the business reason an import must land in the right folder | "The settings of the folder are divided into the general settings and the thumbnail settings." | merchant docs, `shopware-6/content/media/v1-6-2-0.md` |
| Remote thumbnails exist to offload generation to a CDN — an import written against local generation breaks there | "you might want to disable the filesystem thumbnail generation in Shopware and use an external CDN service" | `guides/plugins/plugins/content/media/remote-thumbnail-generation.md` |

## Doc/code divergence

| docs claim | code shows | citation |
| --- | --- | --- |
| The commands reference (and merchant docs) present `media:generate-thumbnails` unconditionally | The whole local generation path, including the command, is disabled when remote thumbnails are enabled | `Content/Media/Upload/MediaFileCleanupService.php:57-68` |
| The custom-file-extension guide pins its `FileSaver` reference to a v6.4.0.0 permalink and names `MediaFileExtensionWhitelistEvent` | In 6.7 extension validation moved to `MediaFileExtensionValidator` + `MediaFileExtensionListProvider`; the 6.4-pinned line reference no longer locates the code | `Content/Media/Upload/MediaFileExtensionValidator.php:24-35` |

## Change log

| old fact (verbatim) | action | why |
| --- | --- | --- |
| States that the source documents reading media and rendering thumbnails (`searchMedia`, `sw_thumbnails`) and the Administration upload component, but not creating a media entity or persisting a file from PHP. | rewritten | The gap assertion holds (docs lane: not-covered), but no lane reported an Administration upload-component page. Replaced with the coverage the docs lane actually found: the three media plugin guides, the Twig display side and the CLI command. |
| Names the closest page actually read, without presenting it as the answer. | removed | Not checkable by a scorer against an answer; the "must not present as documented" constraint is carried by new facts 2 and 3. |
| Invents no service names, method signatures or code for the write path (e.g. does not present `FileSaver`/`MediaService` calls as documented). | rewritten | `MediaService::saveMediaFile()` and `FileSaver::persistFileToMedia()` exist and are the write path, so the ban must be on presenting them as *documented*, not on naming them. The new fact adds the signature and the `$folder`/`$private` traps an answer has to get right, plus the asynchronous-thumbnail fact the old set missed. |
