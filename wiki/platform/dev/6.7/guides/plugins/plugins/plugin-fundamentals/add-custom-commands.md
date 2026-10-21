---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md
title: Add Custom CLI Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html
sourceHash: 37035ef67c9d345ed0f0d17e69b982267e4562c0
codeCheckedAgainst: "6.7.15.1"
keywords: ["console.command", "AsCommand", "Command::SUCCESS", "bin/console", "services.php", "ExampleCommand", "swag:example", "execute", "cli command", "console command", "symfony console", "plugin command"]
summary: Register a Symfony Console command in a Shopware 6.7 plugin via services.php tagged console.command, with an AsCommand class run through bin/console.
lastBuilt: 2026-10-21
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md"]
---
## What it is

How to add a custom CLI command to a Shopware plugin. Shopware CLI commands are Symfony Console commands, so a plugin command follows the standard Symfony approach: a `Command` subclass registered as a service. Once registered, it is available via `bin/console` like any core command.

## When to use

You want a plugin-specific maintenance, import or debug task that an operator runs from the shell (`bin/console <name>`), rather than through the Administration or on a schedule (for periodic work see [Adding a scheduled task](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md)).

## Key steps / config

1. Register the command as a service in the plugin's `src/Resources/config/services.php` and tag it `console.command`:

```php
$services->set(Swag\BasicExample\Command\ExampleCommand::class)
    ->tag('console.command');
```

2. Create the command class at `<plugin root>/src/Command/ExampleCommand.php`. Give it a name and description with the `#[AsCommand]` attribute, extend `Symfony\Component\Console\Command\Command`, and return an exit code from `execute()`:

```php
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'swag:example', description: 'Example command')]
class ExampleCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $output->writeln('Hello from ExampleCommand');
        return Command::SUCCESS;
    }
}
```

3. Run it with `bin/console swag:example`.

Core commands in 6.7.15.1 follow the same pattern: `#[AsCommand(name: ..., description: ...)]` on a `Command` subclass, and a service definition tagged `console.command` in the bundle's DI config.

## Essential identifiers

- service tag `console.command`
- `Symfony\Component\Console\Attribute\AsCommand`
- `Symfony\Component\Console\Command\Command`, `Command::SUCCESS`
- `execute(InputInterface $input, OutputInterface $output): int`
- `src/Resources/config/services.php`, `bin/console`

## Code check (6.7.15.1)
- confirmed `console.command` — tag used on core command service definitions — vendor/shopware/core/Framework/DependencyInjection/api.php:195
- confirmed `AsCommand` — core commands declare name and description via the attribute — vendor/shopware/core/Framework/Event/Command/DebugDumpBusinessEventsCommand.php:15
- confirmed `DebugDumpBusinessEventsCommand::execute()` — protected execute(InputInterface, OutputInterface): int — vendor/shopware/core/Framework/Event/Command/DebugDumpBusinessEventsCommand.php:29
- confirmed `Resources/config` — bundles load service definition files from this directory — vendor/shopware/core/Framework/Bundle.php:224
- unverified `Command::SUCCESS` — Symfony Console constant, vendor/symfony out of scope
