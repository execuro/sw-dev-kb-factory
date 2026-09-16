---
id: platform/dev/6.6/products/extensions/b2b-components/employee-management/concepts/_index.md
title: Concepts
docType: developer
version: "6.6"
versions: ["6.6"]
sourceUrl: https://developer.shopware.com/docs/v6.6/products/extensions/b2b-components/employee-management/concepts/
sourceHash: 9afc22365ce4ae8a7581de28133dca85bc4cb2ab
keywords: ["employee management", "concepts", "employee email", "unique email", "employee invitation", "B2B components", "email uniqueness check", "employee identification", "company customer", "employee account"]
summary: "Notes that employees are uniquely identified by email address, checked for uniqueness on invitation."
lastBuilt: "2026-09-15"
---
## What it is

This is the section index for concepts related to Employee Management, one of the B2B Components. It currently covers a single but important rule for how employees are identified.

## Key steps / config

Employees are uniquely identified via their email address. When a new employee is invited, a check is performed to ensure that email address is not already in use, so each email can only belong to one employee account.

## Essential identifiers

- Employee email address — the unique identifier used to distinguish employee accounts and enforced when a new employee is invited.
