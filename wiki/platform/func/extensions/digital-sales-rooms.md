---
id: platform/func/extensions/digital-sales-rooms.md
title: Digital Sales Rooms
docType: functional
version: "6.5"
versions: ["6.5", "6.6", "6.7"]
sourceUrl: https://docs.shopware.com/en/shopware-6-en/extensions/digital-sales-rooms
sourceHash: cfdfcb72713ae5eff69bfa4b89a1682d68d3968ec86f693a414b24f8348dcdeb
revision:
  current: true
  range: "4.2.0 - 4.2.1"
  swMax: "4.2.1"
  swMin: "4.2.0"
keywords: ["Digital Sales Rooms", "Sales Agent", "daily.co", "Mercure", "presentations", "appointments", "guide view", "real-time discounts", "wishlist", "shopping cart overview", "B2B Components", "quote management", "Beyond plan"]
summary: "Beyond-plan extension for guided/unguided live shopping-event presentations with layouts, real-time discounts, wishlists and quote requests."
lastBuilt: "2026-09-15"
---

## What it is

Digital Sales Rooms (Shopware Beyond-plan extension) lets merchants run real-time or self-guided "shopping event" presentations for selected customers, combining Shopping Experiences layouts with live video, product tools, and checkout.

## When to use

When a merchant wants to guide (or let customers self-navigate) a live/async shopping event with product showcasing, real-time discounts, wishlists, and quote/shopping-list workflows tied into B2B Components.

## Key steps / config

- Requires a daily.co account (API key) and a configured Mercure service, set up by a developer per the developer documentation.
- Module lives at **Marketing > Digital Sales Rooms**; configure API Base Url and API Key per sales channel (or "All sales channels") under **Marketing > Digital Sales Rooms > Configuration**.
- Assign layouts (built with Shopping Experiences) for **Product detail page**, **Quick view**, **Product list page**, and **Finished presentation page**.
- **Presentations**: create a presentation, then add layouts (Landing page, Product page, Category page types); "Overwrite content" edits the layout copy for that presentation only, not the shared standard template.
- **Appointments**: create non-guided (customer self-navigates) or guided (guide leads in real time) appointments; set presentation, guide/sender, mode, name, participants, date range, message, and domain (determines presentation language); invitation e-mails use the store's email templates.
- **Guide view**: start the presentation, add extra product-listing slides, use **saved products**. Tools include Instant product listing (filter/add/remove products), Broadcast mode (mutes all participant mics/cams), screen sharing, notes, navigation menu, list of attendees, recently viewed products, wishlist overview, shopping cart overview, and real-time discounts (absolute or percentage, per participant or selected products).
- **Customer view**: unguided sessions allow free navigation; guided sessions follow the guide; both support wishlist, shopping cart, and checkout as guest or logged-in customer — logging in during a guest session merges carts.
- **Request for quotation** and **Shopping Lists** require enabling Quote Management / shopping lists from B2B Components on the customer record (Customers > Overview > Edit).
- **Appointment Booking**: enable "Allow participants to book a new appointment" under Configurations; customers use a provided booking link (e.g. Microsoft Bookings).

## Essential identifiers

daily.co API key, Mercure service, Marketing > Digital Sales Rooms, guided/non-guided appointment, B2B Components (Quote Management, shopping lists)

## Gotchas

- The Sales Agent frontend is not installable from the admin — it is a separate application built from source code shared via a GitLab repository by an agency/developer.
- Once a presentation ends it cannot be restarted; a new appointment is required, though customers can still browse and edit their cart via the old link until the appointment's end date passes.
- Guest checkout in a guided session still requires registering a customer account to complete the order.

## Version notes

Login as an existing customer during a guided presentation is available from version 4.2.0.
