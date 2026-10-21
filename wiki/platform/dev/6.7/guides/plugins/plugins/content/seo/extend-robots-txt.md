---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/guides/plugins/plugins/content/seo/extend-robots-txt.md
relatedPages:
  - platform/dev/6.7/guides/plugins/plugins/framework/event/listening-to-events.md
sourceHash: d7eec4d57565b1b7b6a142e58ed7ed3da856a51a
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/content/seo/extend-robots-txt.html
title: Extend robots.txt Configuration
version: "6.7"
versions:
  - "6.7"
keywords: ["robots.txt", "RobotsDirectiveParsingEvent", "RobotsUnknownDirectiveEvent", "ParsedRobots", "ParseIssue", "ParseIssueSeverity", "RobotsDirectiveType", "RobotsUserAgentBlock", "kernel.event_listener", "crawler rules", "user-agent block", "custom directive"]
summary: Extend robots.txt parsing with RobotsDirectiveParsingEvent (replace ParsedRobots) and RobotsUnknownDirectiveEvent (handled flag, custom ParseIssue).
lastBuilt: 2026-10-21
---
## What it is

Shopware's storefront parses the configured `robots.txt` text with `RobotsDirectiveParser`, which dispatches two events. A plugin can use them to change the parsed result, add validation issues, or accept non-standard directives. The installed 6.7 API differs from the doc's examples: the events and value objects expose public properties, and the parse result is immutable.

## When to use

- Inject directives dynamically, for example a block for AI crawlers.
- Validate directive values such as `Crawl-delay`.
- Accept vendor-specific directives like `noimageindex`, `noarchive` or `clean-param` without an "unknown directive" warning.

## Key steps / config

1. **Modify the parsed result.** Listen to `Shopware\Storefront\Page\Robots\Event\RobotsDirectiveParsingEvent`. It is dispatched after parsing, and the parser returns `$event->parsedResult`. `ParsedRobots` has readonly `userAgentBlocks`, `orphanedPathDirectives` and `issues`, so build a new one and assign it:

```php
public function __invoke(RobotsDirectiveParsingEvent $event): void
{
    $parsed = $event->parsedResult;
    $block = new RobotsUserAgentBlock('GPTBot', [
        new RobotsDirective(RobotsDirectiveType::DISALLOW, '/checkout/'),
    ]);
    $event->parsedResult = new ParsedRobots(
        [...$parsed->userAgentBlocks, $block], $parsed->orphanedPathDirectives, $parsed->issues
    );
}
```

   Each `RobotsUserAgentBlock` takes one `userAgent` string, so create one block per crawler. The event also exposes `text`, `context` and `salesChannelId`.
2. **Handle unknown directives.** Listen to `Shopware\Storefront\Page\Robots\Event\RobotsUnknownDirectiveEvent`. Its fields are `lineNumber`, `line`, `directiveType`, `directiveValue`, `insideUserAgentBlock`, `context` and `salesChannelId`.
   - Set `$event->handled = true` to suppress the default warning.
   - Or set `$event->issue` to a custom `ParseIssue`, which is used instead of the default warning.
3. **Add validation issues.** Construct `new ParseIssue($lineNumber, $lineContent, $reason, ParseIssueSeverity::WARNING|ERROR)` and append it to the `issues` of a new `ParsedRobots`, as in step 1.
   - Iterate `$parsed->userAgentBlocks`, then each block's `directives`.
   - Compare `$directive->type` with `RobotsDirectiveType::CRAWL_DELAY`, `::ALLOW` or `::DISALLOW`, and read `$directive->value`.
4. **Register** each invokable listener in `services.php`:

```php
$services->set(RobotsExtensionListener::class)
    ->tag('kernel.event_listener', ['event' => RobotsDirectiveParsingEvent::class]);
```

## Essential identifiers

- `Shopware\Storefront\Page\Robots\Event\RobotsDirectiveParsingEvent` (`parsedResult`, `text`, `context`, `salesChannelId`)
- `Shopware\Storefront\Page\Robots\Event\RobotsUnknownDirectiveEvent` (`handled`, `issue`, `directiveType`, `directiveValue`)
- `Shopware\Storefront\Page\Robots\Parser\ParsedRobots`, `ParseIssue`, `ParseIssueSeverity` (`ERROR`, `WARNING`)
- `Shopware\Storefront\Page\Robots\Struct\RobotsUserAgentBlock`, `Shopware\Storefront\Page\Robots\Struct\RobotsDirective`, `Shopware\Storefront\Page\Robots\Struct\RobotsDirectiveType` (`ALLOW`, `DISALLOW`, `CRAWL_DELAY`, `SITEMAP`, `REQUEST_RATE`, `VISIT_TIME`, `HOST`, `USER_AGENT`)
- DI tag `kernel.event_listener`

## Gotchas

- The doc imports the value objects from `Shopware\Storefront\Page\Robots\ValueObject\...`. That namespace does not exist; they live in `...\Robots\Struct\`.
- The doc's methods `getParsedRobots()`, `addUserAgentBlock()`, `addIssue()`, `getDirectiveName()`, `setHandled()`, `getUserAgentBlocks()`, `getDirectives()`, `getType()` and `getValue()` are not in the installed classes. Use the public properties shown above.
- The doc's `ParseIssue(severity:, message:, lineNumber: null)` does not match the constructor. `lineNumber` is a non-nullable `int`, and the text goes in `reason`.
- Per the source, issues are logged when the `robots.txt` configuration is saved in the Administration. Use `WARNING` for recommendations and `ERROR` for problems that prevent generation.

## Version notes

- Full `robots.txt` support was added in Shopware 6.7.1.
- The extension events are documented as available since 6.7.5.

## Code check (6.7.15.1)
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirective` — real class is Robots\Struct\RobotsDirective
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsDirectiveType` — real enum is Robots\Struct\RobotsDirectiveType
- absent `Shopware\Storefront\Page\Robots\ValueObject\RobotsUserAgentBlock` — real class is Robots\Struct\RobotsUserAgentBlock
- corrected `RobotsDirectiveParsingEvent::$parsedResult` — docs: getParsedRobots(); public property, returned by the parser — vendor/shopware/storefront/Page/Robots/Event/RobotsDirectiveParsingEvent.php:23
- corrected `RobotsUnknownDirectiveEvent::$handled` — docs: setHandled(true); public bool property — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:29
- corrected `RobotsUnknownDirectiveEvent::$directiveType` — docs: getDirectiveName() — vendor/shopware/storefront/Page/Robots/Event/RobotsUnknownDirectiveEvent.php:39
- corrected `RobotsUserAgentBlock::__construct()` — docs: userAgents array; takes single string userAgent plus directives — vendor/shopware/storefront/Page/Robots/Struct/RobotsUserAgentBlock.php:14
- corrected `ParsedRobots::$userAgentBlocks` — docs: addUserAgentBlock()/getUserAgentBlocks(); readonly property, no mutators — vendor/shopware/storefront/Page/Robots/Parser/ParsedRobots.php:18
- corrected `ParseIssue::__construct()` — docs: severity/message/lineNumber null; (int lineNumber, lineContent, reason, severity) — vendor/shopware/storefront/Page/Robots/Parser/ParseIssue.php:13
- confirmed `RobotsDirectiveType::CRAWL_DELAY` — enum case 'Crawl-delay' — vendor/shopware/storefront/Page/Robots/Struct/RobotsDirectiveType.php:15
