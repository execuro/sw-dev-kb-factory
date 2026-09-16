---
id: platform/func/settings/Profilesettings.md
title: Profilesettings
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: "https://docs.shopware.com/en/shopware-6-en/settings/Profilesettings"
sourceHash: 845cc219729b6f92be776cfd4b13fbdd1c391e65e38cda9239145b9296043c5a
revision:
  current: true
  range: "6.4.8.0 - 6.6.10.20"
  swMin: "6.4.8.0"
  swMax: "6.6.10.20"
keywords: ["profile settings", "user profile", "password", "profile image", "search settings", "privacy settings", "share usage data", "users and permissions", "GDPR", "admin profile"]
summary: Covers the Administration user profile area — general info, profile image, password, search settings, and privacy/usage-data sharing.
lastBuilt: 2026-09-15
---
## What it is

Personal profile settings, found at the bottom left of the Shopware Administration, let each user manage their own account details and log out.

## When to use

Used when a user wants to change their profile picture or password, adjust which entities the admin search indexes, or opt in/out of sharing usage data with Shopware.

## Key steps / config

- **General**: first name, last name and username are edited under **Settings > System > Users & Permissions**, not here; the personal email address and Administration display language can be changed directly in the profile.
- **Profile image**: uploaded pictures are automatically added to media management.
- **Password**: set a new password for personal access.
- **Search settings**: choose which entities are indexed for the Administration search, with **Select all**, **Deselect all**, and **Reset to default** options.
- **Privacy settings**: toggle **Share usage data** to consent to sharing personal behavioral data with Shopware; Shopware states this processing is GDPR-compliant, stored securely, and not passed to third parties.

## Essential identifiers

- **Settings > System > Users & Permissions** — where name/username are actually edited
- **Share usage data** toggle
- Profile settings tabs: General, Search settings, Privacy settings
