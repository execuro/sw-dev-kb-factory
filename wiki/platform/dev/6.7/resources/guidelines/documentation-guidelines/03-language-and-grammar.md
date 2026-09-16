---
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/03-language-and-grammar.md
title: "Language & Grammar"
docType: developer
version: "6.7"
versions: ["6.7"]
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/03-language-and-grammar.html
sourceHash: 7396d0043a58cba69da9053fb1f8accee1d8ee3c
codeCheckedAgainst: "6.7.13.0"
keywords: ["language and grammar", "style guide", "writing style", "american english", "active voice", "second person", "gender-neutral", "abbreviations", "contractions", "punctuation", "capitalization", "tense", "documentation guidelines", "voice and tone"]
summary: "Shopware docs writing rules: American English, active voice, second person, present tense, abbreviations, contractions, punctuation and word choice."
lastBuilt: 2026-09-15
---
## What it is

The language and grammar section of the Shopware documentation guidelines: the editorial voice, grammar and punctuation rules that contributions to the developer documentation follow. Use American English; the Cambridge dictionary (essential American English) is the reference for vocabulary and spelling.

## When to use

When writing or reviewing Shopware developer documentation (or content meant to match its style) and a question comes up about voice, pronouns, tense, abbreviations or punctuation.

## Key steps / config

### Voice and tone

- Friendly: less formal, down-to-earth, occasionally funny where appropriate.
- Direct and clear: to the point, skimmable, simple.
- Customer focused: assume a knowledgeable reader with varying proficiency.

### Grammar

- **Active voice** by default ("The user passes the access-key."). Passive is fine to emphasize an object over an action, to de-emphasize a subject, or when the doer need not be known.
- **Second person** over first person (*you*, not *we*/*I*); FAQs are the exception. For instructions use the imperative with implicit *you*: "Create a PDF file." rather than "You need to create a PDF file." Avoid *our*.
- **Gender-neutral**: *they* instead of *he/she*; *humankind* instead of *mankind*.
- **Tense**: simple present; avoid future and past tense.
- **Articles**: use an article with acronyms (an ISP, a URL) and nouns (the product database).

### Abbreviations

- Spell out unfamiliar terms on first mention, abbreviation in parentheses: *JSON Web Token (JWT)*; afterwards use the abbreviation only.
- Common ones (API, HTTPS, PDF, XML, PNG, HTML) rarely need spelling out.
- Never abbreviate Shopware product or feature names; never define your own abbreviations.
- Plurals add "s" (APIs, IDEs); acronyms ending in s, sh, ch or x add "es" (OSes, SSHes).
- Shortened words (*app*, *sync*, *etc*): pick one form and stay consistent.
- Limit contractions such as *it's*, *you're*; negation contractions (*isn't*, *don't*, *can't*) are recommended because a missed *not* is harder with them.

### Capitalization and spelling

- Capitalize the first letter of the word after a colon.
- Keep the official capitalization of companies, software, products, services and features.
- A hyphenated word starting a sentence capitalizes only its first element (unless later elements are proper nouns).
- In filenames, URLs and data parameters prefer words spelled the same in all English dictionaries (avoid color/colour).

### Conjunctions and punctuation

- Use *or* instead of a slash, *and* instead of an ampersand.
- Serial (Oxford) comma before the final *and*/*or* in lists of three or more.
- Comma after an introductory word or phrase; semicolon, period or dash before a conjunctive adverb (*however*, *otherwise*) with a comma after it.
- Comma before the conjunction joining two independent clauses unless both are very short.
- Em dash for a break in a sentence; hyphen for prefixes (*self-aware*), number ranges (*25-30 GB*), compound nouns, disambiguation (*logged-in*, *re-mark*) and same-vowel prefixes (*co-op*).
- End every sentence with a period; no period after headings or directly after a URL; period inside closing quotation marks; list items that are full sentences get a period, phrases do not.
- No slashes in dates, fractions or alternatives (*blue/red*).
- Do not hide important information in parentheses.

### Dos and don'ts

- No internet slang, buzzwords, jargon, idioms.
- Vary sentence openings (not always *In order to*, *You can*).
- Polite modal verbs (*may*, *might*) are fine; avoid *please* and *request*.
- Do not write as you speak; keep a slightly formal, uncluttered style.

## Gotchas

- First-person usage is allowed only in FAQs.
- Negation contractions are encouraged even though other contractions should be limited.

## Code check (6.7.13.0)
- unverified `American English` — editorial writing rule with no counterpart in installed code
- unverified `active voice` — editorial writing rule, not a code identifier
- unverified `JSON Web Token (JWT)` — used only as an abbreviation example, no normative code claim
