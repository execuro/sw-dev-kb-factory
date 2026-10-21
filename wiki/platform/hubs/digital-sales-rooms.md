---
id: platform/hubs/digital-sales-rooms.md
title: "Digital Sales Rooms"
summary: "Digital Sales Rooms (DSR): install, configure, customize and deploy the Nuxt frontend, plus Daily.co and Mercure setup, for 6.6 and 6.7."
keywords: ["digital sales rooms", "dsr", "swagdigitalsalesrooms", "dsr-frontends", "nuxt 3", "daily.co", "mercure", "frontend app deployment", "nuxt layer", "plugin configuration", "live video", "beyond plan"]
members:
  - platform/dev/6.6/products/digital-sales-rooms/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/aws.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md
  - platform/dev/6.6/products/digital-sales-rooms/best-practices/saas/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/configuration/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md
  - platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md
  - platform/dev/6.6/products/digital-sales-rooms/customization/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/customization/branding.md
  - platform/dev/6.6/products/digital-sales-rooms/customization/component.md
  - platform/dev/6.6/products/digital-sales-rooms/customization/i18n.md
  - platform/dev/6.6/products/digital-sales-rooms/installation/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/installation/admin-side-installation.md
  - platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md
  - platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/_index.md
  - platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
  - platform/dev/6.7/products/digital-sales-rooms/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/aws.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md
  - platform/dev/6.7/products/digital-sales-rooms/best-practices/saas/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/configuration/config-with-cli.md
  - platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md
  - platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md
  - platform/dev/6.7/products/digital-sales-rooms/customization/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/customization/branding.md
  - platform/dev/6.7/products/digital-sales-rooms/customization/component.md
  - platform/dev/6.7/products/digital-sales-rooms/customization/i18n.md
  - platform/dev/6.7/products/digital-sales-rooms/installation/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/installation/admin-side-installation.md
  - platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md
  - platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md
  - platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md
  - platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md
  - platform/func/extensions/digital-sales-rooms.md
  - platform/func/features/digital-sales-rooms.md
lastBuilt: 2026-10-21
---

# Digital Sales Rooms

Digital Sales Rooms (DSR) is a licensed Shopware extension for live video sales events. It has two parts: the `SwagDigitalSalesRooms` plugin in the Shopware instance, and a standalone Nuxt 3 frontend app (`dsr-frontends`) built on Shopware Frontends. Live video comes from Daily.co and realtime messaging from Mercure. The extension requires a Beyond plan; on SaaS the plugin is preinstalled but the frontend, third-party services and configuration still have to be set up. Use this hub to pick the right page for installation, configuration, customization, deployment or third-party setup instead of grepping the directory.

The 6.6 and 6.7 developer sections mirror each other page for page and are near-duplicates in structure. 6.7 adds `config-with-cli.md` (the `composer dsr:config` setup scripts) and `realtime-service-mercure.md`, which have no 6.6 counterpart.

## Developer 6.7

- [Digital Sales Rooms](platform/dev/6.7/products/digital-sales-rooms/_index.md) — overview, prerequisites (node, pnpm, Shopware 6, Daily.co, Mercure).
- [Installation](platform/dev/6.7/products/digital-sales-rooms/installation/_index.md) — overview of the admin-side and frontend parts.
- [Admin side installation](platform/dev/6.7/products/digital-sales-rooms/installation/admin-side-installation.md) — get and activate `SwagDigitalSalesRooms`.
- [Frontend app installation](platform/dev/6.7/products/digital-sales-rooms/installation/app-installation.md) — `.env.template`, API env vars, `pnpm dev`/`pnpm build`.
- [Setup 3rd parties](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/_index.md) — index of Daily.co and Mercure setup.
- [Realtime Video Call - Daily.co](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md) — obtain the Daily.co API key.
- [Realtime Service - Mercure](platform/dev/6.7/products/digital-sales-rooms/setup-3rd-party/realtime-service-mercure.md) — Mercure hub via Stackhero or Docker, origins and JWT keys.
- [Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/_index.md) — index of domain, plugin and CLI configuration.
- [Configuration with CLI](platform/dev/6.7/products/digital-sales-rooms/configuration/config-with-cli.md) — `composer dsr:config` and its sub-scripts.
- [Domain Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/domain-config.md) — add frontend domains to a sales channel.
- [Plugin Configuration](platform/dev/6.7/products/digital-sales-rooms/configuration/plugin-config.md) — domains, Daily.co and Mercure settings.
- [Customization](platform/dev/6.7/products/digital-sales-rooms/customization/_index.md) — customize the frontend through a Nuxt layer.
- [Branding Customization](platform/dev/6.7/products/digital-sales-rooms/customization/branding.md) — favicon, title, theme colors.
- [Component Customization](platform/dev/6.7/products/digital-sales-rooms/customization/component.md) — override components such as `SwWishlistButton.vue`.
- [I18n Customization](platform/dev/6.7/products/digital-sales-rooms/customization/i18n.md) — `@nuxtjs/i18n` and `langDir`.
- [Best practices](platform/dev/6.7/products/digital-sales-rooms/best-practices/_index.md) — section index.
- [Frontend App Deployment](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/_index.md) — static hosting vs Node.js server.
- [AWS](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/aws.md) — AWS Amplify deployment.
- [Cloudflare](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md) — Cloudflare Pages via wrangler or GitHub Actions.
- [Ubuntu Server with PM2](platform/dev/6.7/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md) — self-hosting with PM2.
- [SaaS](platform/dev/6.7/products/digital-sales-rooms/best-practices/saas/_index.md) — what remains to do for Beyond SaaS merchants.

## Developer 6.6

- [Digital Sales Rooms](platform/dev/6.6/products/digital-sales-rooms/_index.md) — overview.
- [Installation](platform/dev/6.6/products/digital-sales-rooms/installation/_index.md) — installation index.
- [Admin side installation](platform/dev/6.6/products/digital-sales-rooms/installation/admin-side-installation.md) — plugin install via download or composer.
- [Frontend app installation](platform/dev/6.6/products/digital-sales-rooms/installation/app-installation.md) — `dsr-frontends` setup and build.
- [Setup 3rd parties](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/_index.md) — Daily.co and Mercure index.
- [Realtime Video Call - Daily.co](platform/dev/6.6/products/digital-sales-rooms/setup-3rd-party/realtime-video-dailyco.md) — Daily.co API key (no separate Mercure page in 6.6).
- [Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/_index.md) — configuration index.
- [Domain Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/domain-config.md) — frontend domains on a sales channel.
- [Plugin Configuration](platform/dev/6.6/products/digital-sales-rooms/configuration/plugin-config.md) — Appointments, Video and Audio, Realtime service fields.
- [Customization](platform/dev/6.6/products/digital-sales-rooms/customization/_index.md) — Nuxt layer customization index.
- [Branding Customization](platform/dev/6.6/products/digital-sales-rooms/customization/branding.md) — favicon, title, theme color.
- [Component Customization](platform/dev/6.6/products/digital-sales-rooms/customization/component.md) — Wishlist button override.
- [I18n Customization](platform/dev/6.6/products/digital-sales-rooms/customization/i18n.md) — translations in a layer.
- [Best practices](platform/dev/6.6/products/digital-sales-rooms/best-practices/_index.md) — section index.
- [Frontend App Deployment](platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/_index.md) — deployment options.
- [AWS](platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/aws.md) — AWS Amplify Hosting.
- [Cloudflare](platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/cloudflare.md) — Cloudflare Pages.
- [Hosting a Frontend App on an Ubuntu Server with PM2](platform/dev/6.6/products/digital-sales-rooms/best-practices/app-deployment/hosted-with-ubuntu-server.md) — PM2 on Ubuntu.
- [SaaS](platform/dev/6.6/products/digital-sales-rooms/best-practices/saas/_index.md) — Beyond SaaS notes.

## Merchant and functional

- [Digital Sales Rooms (extension)](platform/func/extensions/digital-sales-rooms.md) — Beyond-plan extension: presentations, appointments, guide and customer views, discounts, quotes.
- [Digital Sales Rooms (feature)](platform/func/features/digital-sales-rooms.md) — short feature overview of live consultation events; setup is on the extension page.
