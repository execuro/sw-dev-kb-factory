---
id: platform/dev/6.6/resources/guidelines/code/document-code.md
title: Document Code
docType: developer
version: "6.6"
versions:
  - "6.6"
sourceUrl: "https://developer.shopware.com/docs/v6.6/resources/guidelines/code/document-code.html"
sourceHash: "c44456b64c9c8ed4d531514d5d4847a7bd896c59"
keywords: ["document code", "docblock", "@param", "@return", "@throws", "interfaces", "abstract classes", "coding guidelines", "documentation"]
summary: "Doc block rules: describe interface/abstract methods, drop redundant @param/@return already covered by type hints, use @throws for direct exceptions."
lastBuilt: "2026-09-15"
---
## What it is
Coding guideline on when and how to write PHP doc blocks in Shopware core code.

## Key steps / config
- Methods of interfaces or abstract classes should always have a doc block describing what the function is used for and what an implementation has to take into account.
- Avoid unnecessary doc block lines, including `@param` and `@return` annotations, as long as they are already defined by type hints.
- Document all exceptions thrown directly by the function via the `@throws` annotation.
- Exceptions that could be thrown by a library are not included in the doc blocks.
