---
id: platform/dev/6.6/guides/plugins/plugins/framework/filesystem/filesystem.md
title: Filesystem - Flysystem
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/framework/filesystem/filesystem.html
sourceHash: 5e3028f7553aab794dd569fdfdef11c8fe9cd4dc
keywords: ["Flysystem", "FilesystemOperator", "filesystem.public", "filesystem.private", "plugin filesystem namespace", "snake case plugin name", "read write files", "League Flysystem"]
summary: "How to register a service using per-plugin public/private Flysystem namespaces to read, write, and list files."
lastBuilt: "2026-09-15"
---
## What it is
Flysystem is a PHP file storage library providing one consistent interface across different storage backends; Shopware exposes it to plugins via injectable namespaces.

## When to use
Use when a plugin needs to read, write, or list files (e.g. invoices, product media) without depending on the storage backend's specifics.

## Key steps / config
1. Every plugin/bundle automatically gets a private and public namespace generated at plugin installation, named `<snake_case_plugin_name>.filesystem.private`/`.public`, e.g.:
   - `swag_basic_example.filesystem.public`
   - `swag_basic_example.filesystem.private`
2. Register a service depending on `League\Flysystem\FilesystemOperator` for each namespace:
```php
class ExampleFilesystemService
{
    public function __construct(FilesystemOperator $fileSystemPublic, FilesystemOperator $fileSystemPrivate) { ... }
    public function readPrivateFile(string $filename) { return $this->fileSystemPrivate->read($filename); }
    public function writePrivateFile(string $filename, string $content) { $this->fileSystemPrivate->write($filename, $content); }
    public function listPublicFiles(): array { return $this->fileSystemPublic->listContents(); }
}
```
3. Wire the namespaces as service arguments in `services.xml`:
```xml
<service id="Swag\BasicExample\Service\ExampleFilesystemService">
    <argument type="service" id="swag_basic_example.filesystem.public"/>
    <argument type="service" id="swag_basic_example.filesystem.private"/>
</service>
```

## Essential identifiers
- `League\Flysystem\FilesystemOperator`
- `<plugin>.filesystem.public`, `<plugin>.filesystem.private`
- `read()`, `write()`, `listContents()`

## Gotchas
- Also, default shop-wide namespaces exist for private files (invoices, delivery notes), public files (product pictures, media), theme files, sitemap files, and bundle assets — distinct from per-plugin namespaces.
