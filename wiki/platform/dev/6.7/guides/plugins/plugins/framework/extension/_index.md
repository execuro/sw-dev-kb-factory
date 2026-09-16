---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md
title: Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/
sourceHash: 4c772f0895c365ec92daa5707bc71a6fff4157d4
codeCheckedAgainst: "6.7.13.0"
keywords: ["extension points", "Extension", "ExtensionDispatcher", "publish", "stopPropagation", "result", "replace core functionality", "intercept execution flow", "pre post error events", "events vs extension points", "extension system"]
summary: Overview of Extension Points - intercept and replace core logic via Extension objects published by ExtensionDispatcher, unlike notification-only events.
lastBuilt: 2026-09-15
---
## What it is

Section index for Extension Points: a mechanism that lets a plugin **replace core functionality** by intercepting and modifying the execution flow of a system process. Traditional events, by contrast, only notify about something that happened.

## When to use

You want to change how a core process computes its result (not just observe it). The pages in this section cover finding existing extension points, creating custom ones, and choosing between extension points and events.

## Key steps / config

In the installed code the mechanism consists of two classes in `Shopware\Core\Framework\Extensions`:

- `Extension` — abstract base every extension point extends; carries a public `$result` (the typed return value), a public `$exception`, and `stopPropagation()`. Concrete classes declare `public const NAME`.
- `ExtensionDispatcher::publish(string $name, Extension $extension, callable $function)` — dispatches `<name>.pre`, runs the default `$function` unless a subscriber stopped propagation, dispatches `<name>.error` if it throws (rethrowing when no subscriber supplied a result), then dispatches `<name>.post` and returns the result.

A plugin subscribes to the `.pre`/`.post`/`.error` event names with a normal event subscriber.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Extension::stopPropagation()`, `Extension::$result`

## Code check (6.7.13.0)
- confirmed `Extension` — abstract base implementing StoppableEventInterface — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::$result` — public typed result property — vendor/shopware/core/Framework/Extensions/Extension.php:20
- confirmed `Extension::$exception` — holds the thrown error for the error phase — vendor/shopware/core/Framework/Extensions/Extension.php:22
- confirmed `Extension::stopPropagation()` — short-circuits the default implementation — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `ExtensionDispatcher::publish()` — pre, default function, error (rethrow without result), post — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ExtensionDispatcher::error()` — builds the `<name>.error` event name — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:41
