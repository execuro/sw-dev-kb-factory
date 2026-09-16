---
id: platform/func/settings/email-templates.md
title: Email Templates
docType: functional
version: "6.5"
versions: ["6.5", "6.6"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/settings/email-templates
sourceHash: f795cc504bc2862ac63e726e8e46463322a6083e1bff05637ed67d5fac429ec0
revision:
  current: true
  range: "6.5.0.0 - 6.6.10.10"
  swMin: "6.5.0.0"
  swMax: "6.6.10.10"
keywords: ["email templates", "header and footer", "mail text", "flow builder", "business events", "mail variables", "order.orderCustomer", "customerRecovery", "userRecovery", "newsletterRecipient", "salesChannel variable", "senderMail", "custom fields in email", "transactional emails"]
summary: How to edit Shopware's email templates, headers/footers, and the Twig-style variables available in mail text, per template type.
lastBuilt: 2026-09-15
---
## What it is

The **Settings > Content > Email templates** area is where merchants maintain the templates for transactional emails (registration, order confirmation, status changes, etc.) and the shared headers/footers inserted into those emails. Which email is sent for which event is configured separately in the flow builder; the B2B suite instead uses business events.

## When to use

Use this page to change wording, add attachments, or insert dynamic data (order number, customer name, etc.) into any of Shopware's standard or extension-added email templates, or to define a shared header/footer reused across templates.

## Key steps / config

- The overview splits into **Templates** and **Header and Footer** sections; compact mode, column visibility, and page size are configurable per user.
- Editing an email template: **Languages**, **Information** (Type, Description), **Options** (subject, sender name — the sender address itself comes from Settings > General > Basic information), **Attachments** (per language), **Mail Text** (HTML and plain text versions recommended).
- Headers/footers are created separately and then assigned to one or more sales channels; they hold shared content like a logo (header) or greeting (footer) so it does not need repeating per template.
- Variables use dot-separated array paths inside double curly braces, e.g.:

```
{{order.orderCustomer.firstName}}
```

- Typing `{{` in the mail text editor shows the arrays available for that specific template (e.g. `customerRecovery` for the password recovery email); typing a dot after an array lists its sub-elements.
- Conditional content per payment method uses a Twig `for`/`if` block over `order.transactions`, matching `transactions.paymentMethodId` against an ID obtained from **Settings > Commerce > Payment methods**.
- Custom fields are exposed the same way, e.g. `{{customer.customFields.additional_info}}`.

## Essential identifiers

- Variable roots: `order`, `orderCustomer`, `customer`, `customerGroup`, `customerRecovery`, `userRecovery`, `newsletterRecipient`, `contactFormData`, `salesChannel`.
- Example paths: `order.orderNumber`, `order.orderCustomer`, `order.transactions.first`, `order.lineItems[0].payload.productNumber`, `order.deliveries[0].trackingCodes[0]`, `salesChannel.domains.0.url`.
- Standard template names referenced: Customer Registration, Order confirmation, Password change request, Customer password recovery, User password recovery, Newsletter registration, Newsletter double opt-in.

## Gotchas

- Variable names are shown incompletely when picked from the UI list for multi-level arrays (e.g. picking `product.translated` still requires manually appending `.name`); the field must resolve (green check) or the template cannot be saved.
- Only languages already created under Settings > General > Languages appear in the template's language selector.
- Some mail providers reject HTML-formatted email, so both an HTML and a plain-text version of the mail text should be maintained.
