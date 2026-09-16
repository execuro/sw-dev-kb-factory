---
id: platform/guidelines/6.7/be-code-guidelines.md
title: Backend code guidelines
versions: ["6.7"]
lastBuilt: 2026-08-30
---
Shopware's backend code guidelines for 6.7, synthesized from the developer docs.

## Naming conventions

Use PascalCase for classes, camelCase for methods and properties.

## Dependency injection

Constructor-inject services; never use the container as a service locator.

## Testing

Write PHPUnit tests for every new service under `tests/Unit`.

## Formatting

Follow PSR-12; run `php-cs-fixer` before committing.

## Deprecated API usage

Legacy static facades are deprecated; use injected services instead.
