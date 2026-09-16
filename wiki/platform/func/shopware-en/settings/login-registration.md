---
id: platform/func/shopware-en/settings/login-registration.md
title: Login Registration
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-en/settings/login-registration
sourceHash: 6271e30bd7230e0c99a2097a472940bd73029d6c7b341a38830fc903ace609c6
revision:
  current: true
  range: "6.4.5.0 - 6.7.0.0"
  swMax: "6.7.0.0"
  swMin: "6.4.5.0"
keywords: ["Log-in & sign-up", "customer registration", "double opt-in", "guest order", "guest account expiry", "password recovery URL", "customer assignment", "sales channel", "salutation field", "birthday field", "minimum password length", "account deletion"]
summary: "Settings > Customer > Log-in & sign-up controls registration fields, double opt-in, guest orders, password rules, and customer assignment."
lastBuilt: "2026-09-15"
---
## What it is

**Settings > Customer > Log-in & sign-up** configures the customer login/registration process: which fields are shown, which are mandatory, and related security/behavior options. Customer title, name and address fields are always mandatory and cannot be deactivated.

## When to use

Use this page to adjust registration requirements, guest checkout behavior, double opt-in confirmation flows, and to bind customers to a specific sales channel.

## Key steps / config

Settings apply globally or per sales channel:
- Minimum password length on customer sign-up.
- Create a customer account by default: when off, checkout treats registrants as guests unless they tick a checkbox to create an account; when on, an account is created unless the customer ticks a guest-order checkbox.
- Save customer IP addresses in plain text (otherwise the last segments are anonymised).
- Show salutation / Show title.
- Email address must be entered twice.
- Double opt-in on sign-up: sends the "Double opt in registration" email template.
- Double opt-in for guest orders: sends the "Double opt in guest order" email template.
- Confirmation URL for double opt-in on sign-up.
- Password must be entered twice.
- Show phone number / Phone number field required.
- Show birthday field / Birthday field required.
- Show selection between company and customer account (enables business accounts with VAT ID).
- Show additional address field 1/2, and their required toggles.
- Arrangement of address fields City, ZIP, State (three ordering options).
- Clear and delete cart on log-out.
- Allow customer deletion (adds a self-delete link in the profile; legally retained data such as orders is not deleted).
- Expiry time of guest customer accounts (in seconds; `0` disables deletion).
- Data protection information must be accepted via a checkbox.
- Password recovery URL.
- Double opt-in domain: custom domain for double opt-in functions (password recovery, registration); if left empty, the sales channel's domain is used.

**Customer assignment**: binds customers to a sales channel via a toggle in the Customer Assignment section.

## Essential identifiers

- `Settings > Customer > Log-in & sign-up`
- Email templates: "Double opt in registration", "Double opt in guest order"
- Section: Customer assignment

## Gotchas

- Customer information such as title, name and address are mandatory fields that cannot be deactivated.
- If the Double opt-in domain field is left empty, the sales channel's own domain is used instead.
