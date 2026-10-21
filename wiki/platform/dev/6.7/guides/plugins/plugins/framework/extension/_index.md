---
id: platform/dev/6.7/guides/plugins/plugins/framework/extension/_index.md
title: Extension Points
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/framework/extension/
sourceHash: 4c772f0895c365ec92daa5707bc71a6fff4157d4
codeCheckedAgainst: "6.7.15.1"
keywords: ["extension points", "Extension", "ExtensionDispatcher", "publish", "stopPropagation", "result", ".pre", ".post", ".error", "replace core functionality", "intercept execution flow", "events vs extension points"]
summary: "Overview of Shopware Extension Points: Extension objects that let plugins replace core logic via .pre/.post/.error events, unlike notification events."
lastBuilt: 2026-10-21
---
## What it is

Section index for Extension Points. Extension Points let a plugin **replace core functionality** by intercepting and modifying the execution flow of a system process, whereas traditional events only notify that something happened.

## When to use

Start here when you need to change how a core process works (not just react to it) and want the overview before reading the guides on finding existing extension points, creating custom ones, and choosing between extension points and events.

## Key steps / config

In the installed code, an extension point is a subclass of the abstract `Shopware\Core\Framework\Extensions\Extension` that a core service hands to `Shopware\Core\Framework\Extensions\ExtensionDispatcher::publish($name, $extension, $function)`. The dispatcher then:

1. dispatches `<NAME>.pre` — a subscriber may set `$extension->result` and call `stopPropagation()` to skip the default implementation;
2. otherwise runs the default `$function`, called with the extension's public properties as named arguments;
3. on a thrown error, stores it in `$extension->exception` and dispatches `<NAME>.error` — a subscriber can supply a fallback `result`, otherwise the exception is rethrown;
4. dispatches `<NAME>.post` and returns `$extension->result()`.

## Essential identifiers

- `Shopware\Core\Framework\Extensions\Extension`
- `Shopware\Core\Framework\Extensions\ExtensionDispatcher`
- `Extension::onPre()`, `Extension::onPost()`, `Extension::onError()`
- `$result`, `$exception`, `stopPropagation()`

## Code check (6.7.15.1)
- confirmed `Extension` — abstract base class implementing `StoppableEventInterface` — vendor/shopware/core/Framework/Extensions/Extension.php:13
- confirmed `Extension::$result` — public mixed result, typed via `TResultType` template — vendor/shopware/core/Framework/Extensions/Extension.php:20
- confirmed `Extension::onPre()` — static helper returning the `.pre` event name from `static::NAME` — vendor/shopware/core/Framework/Extensions/Extension.php:38
- confirmed `Extension::stopPropagation()` — skips the default implementation when called in `.pre` — vendor/shopware/core/Framework/Extensions/Extension.php:98
- confirmed `ExtensionDispatcher::publish()` — dispatches pre, runs default, error, post — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:53
- confirmed `ExtensionDispatcher::error()` — dispatched on a thrown default; rethrown if no subscriber sets a result — vendor/shopware/core/Framework/Extensions/ExtensionDispatcher.php:65
