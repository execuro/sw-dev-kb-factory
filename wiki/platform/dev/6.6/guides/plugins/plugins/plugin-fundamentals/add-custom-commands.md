---
id: platform/dev/6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.md
title: Add custom CLI commands
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: "https://developer.shopware.com/docs/v6.6/guides/plugins/plugins/plugin-fundamentals/add-custom-commands.html"
sourceHash: "f7d517cc7228bb0ce228b8ce1457d6be714d3191"
keywords: ["CLI command", "console command", "bin/console", "console.command tag", "AsCommand", "Command class", "services.xml", "Symfony console", "configure", "execute", "InputInterface", "OutputInterface"]
summary: "Add a custom bin/console command from a plugin: a Command class tagged console.command in services.xml."
lastBuilt: "2026-09-15"
---
## What it is

A guide on adding new commands to Shopware's `bin/console`, using the same mechanism Symfony
itself uses for its own commands. Commands integrate fully into Symfony and Shopware, so they
have access to all functionality offered by both, not just standalone PHP scripts.

## When to use

Use this guide when a plugin needs a task runnable from the command line — for example a
maintenance, import, or administrative task — rather than only through the web UI or API. It
assumes a plugin with a `services.xml` file already loaded from a `Resources/config`
directory relative to the plugin's base class location.

## Key steps / config

1. Register the command service in the plugin's `services.xml`, tagged `console.command`:

```xml
<services>
    <service id="Swag\BasicExample\Command\ExampleCommand">
        <tag name="console.command"/>
    </service>
</services>
```

2. Create the command class extending `Symfony\Component\Console\Command\Command`, naming it
   with the `#[AsCommand(name: '...')]` attribute (example: `swag-commands:example`),
   implementing `configure()` (e.g. `$this->setDescription(...)`) and `execute(InputInterface
   $input, OutputInterface $output): int`, returning `Command::SUCCESS`.
3. Run `bin/console list` to see all available commands, or run the new command directly, e.g.
   `php bin/console swag-commands:example`. Commands are grouped by namespace (e.g. `cache`,
   as in `cache:clear`).

## Essential identifiers

- `console.command` — the DI tag that registers a class as a console command.
- `Symfony\Component\Console\Command\Command` — the base class a command extends.
- `#[AsCommand(name: '...')]` — the attribute that names the command.
- `configure()`, `execute(InputInterface $input, OutputInterface $output): int`
- `bin/console` — the executable commands are run through; `bin/console list` lists them.
- `Command::SUCCESS` — the return value signaling a successful run.

## Gotchas

This guide does not cover how to create a new plugin — a plugin (with the plugin base guide
already applied) is a prerequisite, since the `services.xml` file and its `Resources/config`
location must already exist for the `console.command` tag to be picked up.
