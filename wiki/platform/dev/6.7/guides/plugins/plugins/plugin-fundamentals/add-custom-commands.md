---
id: platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md
title: Add Custom CLI Commands
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html
sourceHash: 37035ef67c9d345ed0f0d17e69b982267e4562c0
codeCheckedAgainst: "6.7.13.0"
keywords: ["console.command", "AsCommand", "Command", "bin/console", "services.php", "ExampleCommand", "swag:example", "cli command", "console command", "symfony console", "custom command", "execute"]
summary: "Add a Symfony Console command to a Shopware plugin: service in services.php tagged console.command, class with AsCommand attribute."
lastBuilt: 2026-09-15
relatedPages: ["platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md"]
---
## What it is

Shopware CLI commands are plain Symfony Console commands. A plugin adds one by registering the command class as a service tagged `console.command`; it then shows up in `bin/console`.

## When to use

For manual or scripted CLI work in a plugin (maintenance, imports, one-off jobs). For recurring background work use a [scheduled task](platform/dev/6.7/guides/plugins/plugins/plugin-fundamentals/add-scheduled-task.md) instead.

## Key steps / config

1. Register the command in `<plugin root>/src/Resources/config/services.php` and tag it:

```php
$services->set(Swag\BasicExample\Command\ExampleCommand::class)
    ->tag('console.command');
```

2. Create the command class at `<plugin root>/src/Command/ExampleCommand.php`:

```php
namespace Swag\BasicExample\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'swag:example', description: 'Example command')]
class ExampleCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    { $output->writeln('Hello from ExampleCommand'); return Command::SUCCESS; }
}
```

3. Run it with `bin/console swag:example`.

The plugin base class (`Shopware\Core\Framework\Bundle::build()`) loads every `Resources/config/services.*` file next to the plugin class (XML, YAML or PHP loaders), so no extra wiring is needed beyond the service definition.

## Essential identifiers

- `console.command` — service tag
- `Symfony\Component\Console\Attribute\AsCommand` — name/description attribute
- `Symfony\Component\Console\Command\Command` — base class; `execute()` returns `Command::SUCCESS`
- `src/Resources/config/services.php` — service registration file
- `bin/console` — CLI entry point

## Gotchas

- Use a vendor prefix in the command name (the example uses `swag:`) to avoid collisions; core commands use prefixes such as `scheduled-task:`.
- `execute()` must return an int exit code.

## Code check (6.7.13.0)
- confirmed `console.command` — tag applied to core command services — vendor/shopware/core/Framework/DependencyInjection/app.php:720
- confirmed `AsCommand` — core commands use the same attribute — vendor/shopware/core/Framework/MessageQueue/Command/ScheduledTaskRunner.php:18
- confirmed `Bundle::build()` — registers the bundle container files — vendor/shopware/core/Framework/Bundle.php:34
- confirmed `Resources/config/services.*` — globbed and loaded with Xml/Yaml/Php loaders — vendor/shopware/core/Framework/Bundle.php:222
- confirmed `scheduled-task:register` — example of a prefixed core command name — vendor/shopware/core/Framework/MessageQueue/Command/RegisterScheduledTasksCommand.php:13
- unverified `Command::SUCCESS` — vendor/symfony/console, out of scope
- unverified `Command::execute()` — vendor/symfony/console, out of scope
