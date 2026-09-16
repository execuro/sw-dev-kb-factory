---
id: platform/dev/6.7/guides/plugins/plugins/content/seo/extend-robots-txt.md
title: Extend robots.txt Configuration
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/extend-robots-txt.html
sourceHash: d7eec4d57565b1b7b6a142e58ed7ed3da856a51a
codeCheckedAgainst: "6.7.13.0"
keywords: ["robots.txt", "RobotsDirectiveParsingEvent", "RobotsUnknownDirectiveEvent", "ParsedRobots", "ParseIssue", "ParseIssueSeverity", "RobotsDirectiveParser", "core.basicInformation.robotsRules", "kernel.event_listener", "crawler rules", "user-agent block", "seo"]
summary: "Extend robots.txt parsing (6.7.5+): modify ParsedRobots in RobotsDirectiveParsingEvent, accept custom directives via RobotsUnknownDirectiveEvent."
lastBuilt: 2026-09-15
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
---
## What it is

Shopware supports `robots.txt` with standard directives and user-agent blocks since 6.7.1. Since 6.7.5 the parsing can be extended with two Storefront events: one to modify the parsed result, one to handle unknown or vendor-specific directives.

## When to use

- Adding directives dynamically, e.g. disallowing `/checkout/` for AI crawlers.
- Accepting non-standard directives (`noimageindex`, `noarchive`, `clean-param`) without warnings.
- Adding custom validation (crawl-delay limits, conflicting Allow/Disallow). See [event listeners](platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md).

## Key steps / config

1. Register an invokable listener: `->tag('kernel.event_listener', ['event' => RobotsDirectiveParsingEvent::class])`.
2. In `Shopware\Storefront\Page\Robots\Event\RobotsDirectiveParsingEvent`, replace the public writable `parsedResult` (`Shopware\Storefront\Page\Robots\Parser\ParsedRobots`); `RobotsDirectiveParser::parse()` returns it. Its `userAgentBlocks`, `orphanedPathDirectives` and `issues` are readonly, so build a new object:

```php
$parsed = $event->parsedResult;
$block = new RobotsUserAgentBlock('GPTBot', [
    new RobotsDirective(RobotsDirectiveType::DISALLOW, '/checkout/'),
]);
$event->parsedResult = new ParsedRobots(
    [...$parsed->userAgentBlocks, $block],
    $parsed->orphanedPathDirectives,
    [...$parsed->issues, $issue],
);
```

   The value classes are in `Shopware\Storefront\Page\Robots\Struct\`. A block holds one `string $userAgent` (one block per crawler); a directive exposes readonly `type` and `value`.
3. Custom directives: listen to `Shopware\Storefront\Page\Robots\Event\RobotsUnknownDirectiveEvent` (per unknown line; properties `directiveType`, `directiveValue`, `line`, `lineNumber`). Set `$event->handled = true` to suppress the warning, or `$event->issue` to replace it.
4. Issues: `new ParseIssue($lineNumber, $lineContent, $reason, ParseIssueSeverity::WARNING)` — `WARNING` for recommendations, `ERROR` for critical problems. Saving `core.basicInformation.robotsRules` makes `RobotsConfigChangeSubscriber` parse and log them.

## Essential identifiers

- `Shopware\Storefront\Page\Robots\Event\RobotsDirectiveParsingEvent`
- `Shopware\Storefront\Page\Robots\Event\RobotsUnknownDirectiveEvent`
- `Shopware\Storefront\Page\Robots\Parser\ParsedRobots`, `ParseIssue`, `ParseIssueSeverity`
- `core.basicInformation.robotsRules`

## Gotchas

- The docs import `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirective`, `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirectiveType` and `Shopware\Storefront\Page\Robots\ValueObject\RobotsUserAgentBlock`; that namespace does not exist — use `Struct`.
- The docs' `getParsedRobots()`, `addUserAgentBlock()`, `addIssue()`, `getDirectiveName()`, `setHandled()` and `getType()`/`getValue()` do not exist in 6.7.13.

## Version notes

- 6.7.1: `robots.txt` support; 6.7.5: parsing events.

## Code check (6.7.13.0)
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirective` — not in the installed code index; class is in the Struct namespace
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirectiveType` — not in the installed code index; enum is in the Struct namespace
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsUserAgentBlock` — not in the installed code index; class is in the Struct namespace, takes a single userAgent string
- corrected `RobotsDirectiveParsingEvent::$parsedResult` — docs: getParsedRobots() and addIssue(); public writable property instead — vendor/shopware/storefront/Page/Robots/Event/RobotsDirectiveParsingEvent.php:23
- confirmed `ParsedRobots::$userAgentBlocks` — readonly array, replace the ParsedRobots object to add blocks — vendor/shopware/storefront/Page/Robots/Parser/ParsedRobots.php:18
- corrected `RobotsUnknownDirectiveEvent::$handled` — docs: setHandled(true); public bool property — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:27
- corrected `RobotsUnknownDirectiveEvent::$directiveType` — docs: getDirectiveName(); public readonly property — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:37
- corrected `ParseIssue::__construct()` — docs: severity, message, lineNumber; actual lineNumber, lineContent, reason, severity — vendor/shopware/storefront/Page/Robots/Parser/ParseIssue.php:13
- confirmed `RobotsDirectiveParser::parse()` — dispatches the parsing event and returns its parsedResult — vendor/shopware/storefront/Page/Robots/Parser/RobotsDirectiveParser.php:26
- confirmed `core.basicInformation.robotsRules` — config key parsed on save — vendor/shopware/storefront/Page/Robots/RobotsConfigChangeSubscriber.php:37
