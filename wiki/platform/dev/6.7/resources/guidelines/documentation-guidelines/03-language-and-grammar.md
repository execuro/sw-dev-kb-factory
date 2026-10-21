---
codeCheckedAgainst: "6.7.15.1"
docType: developer
id: platform/dev/6.7/resources/guidelines/documentation-guidelines/03-language-and-grammar.md
sourceHash: 7396d0043a58cba69da9053fb1f8accee1d8ee3c
sourceUrl: https://developer.shopware.com/docs/resources/guidelines/documentation-guidelines/03-language-and-grammar.html
title: Language & Grammar
version: "6.7"
versions:
  - "6.7"
keywords: ["language and grammar", "american english", "voice and tone", "active voice", "second person", "gender-neutral", "abbreviations", "contractions", "tense", "capitalization", "punctuation", "em dash", "style guide", "documentation guidelines"]
summary: "Shopware docs writing rules: American English, friendly direct tone, active voice, second person, abbreviations, tense, capitalization, punctuation."
lastBuilt: 2026-10-21
---
## What it is

The language and grammar section of the Shopware documentation guidelines. It defines the editorial voice and the grammar, abbreviation, and punctuation rules that keep Shopware documentation consistent in content and style.

## When to use

When writing, editing, or reviewing Shopware documentation text and you need a decision on spelling, voice, person, tense, abbreviations, capitalization, or punctuation.

## Key steps / config

### Language and voice

- Use American English for a global audience; spellings follow the Cambridge dictionary (Essential American English).
- Tone is friendly and conversational, direct, clear, and human. Voice principles:
  - **Friendly** — less formal, down-to-earth; occasionally funny where appropriate.
  - **Direct and clear** — to the point; a skim should give a clear idea; simple above all.
  - **Customer focussed** — assume a knowledgeable reader with varying proficiency.

### Active, passive, and person

- Prefer active voice ("The user passes the access-key.") over passive ("The access-key is passed by the user.").
- Passive is acceptable to emphasize an object over the action, to de-emphasize the subject, or when the doer need not be known.
- Use second person (*you*) over first person (*we*, *I*); first person is allowed in FAQs.
- For instructions use the imperative with implicit *you*: "Create a PDF file.", not "You need to create a PDF file."
- Avoid *our* in sentences.
- Use gender-neutral pronouns (*they*) and words (humankind, not mankind).

### Abbreviations

- Spell out unfamiliar abbreviations on first use followed by the abbreviation in parentheses, e.g. *JSON Web Token (JWT)*; use only the abbreviation afterwards.
- Some never need spelling out: *API, HTTPS*, file formats such as *PDF, XML, PNG, HTML*.
- Never abbreviate Shopware product or feature names; do not invent abbreviations — use industry-standard ones only.
- Plurals add "s" (*APIs, IDEs*); if the acronym ends in s, sh, ch, or x, add "es" (*OSes, SSHes*).
- Shortened words (*etc*, *app*, *sync*): use either the short or the full form consistently throughout a document.
- Limit contractions (*it's, you're, let's*); negation contractions (*isn't, don't, can't*) are recommended because a reader can easily miss *not*.

### Tense and articles

- Use simple present tense; avoid future and past tense.
- Use articles with acronyms (an ISP, a URL) and nouns (the product database).

### Capitalization and spelling

- Capitalize the first letter of the word after a colon.
- Follow the official capitalization of company, software, product, service, and feature names.
- A hyphenated word starting a sentence capitalizes only its first element, unless a later element is a proper noun or adjective.
- Prefer filenames, URLs, and data parameters whose spelling does not differ between dictionaries (avoid color versus colour).

### Conjunctions and punctuation

- Use *or* instead of a slash and *and* instead of an ampersand.
- Use the serial comma before the final *and*/*or* in a list of three or more.
- Put a comma after an introductory word or phrase, and after a conjunctive adverb (*however*, *otherwise*), which itself is preceded by a semicolon, period, or dash.
- Insert a comma before a conjunction joining two independent clauses unless both are very short.
- Use an em dash for a break in a sentence; use a hyphen for prefixes (*self-aware*), number ranges (*25-30 GB*), compound nouns, disambiguation (*logged-in, re-mark*), and doubled vowels (*co-op*).
- End every sentence with a period, including complete sentences in lists (phrases in lists are the exception); never end headings or URLs with a period; put the period inside closing quotation marks.
- Do not use slashes in dates, fractions, or for alternatives (*blue/red*).
- Do not put important information in parentheses.

### Dos and don'ts

- No internet slang, buzzwords, jargon, idioms, or set phrases.
- Do not start every sentence with the same phrase (*In order to*, *You can*).
- Polite modal words (*may*, *might*) are fine; avoid request words (*please*, *request*).
- Do not write as you speak; add some formality and include only enough information for the reader to complete the task.

## Gotchas

- First person is not banned outright: FAQs are the stated exception.
- Contractions are to be limited in general, but negation contractions are explicitly recommended.

## Code check (6.7.15.1)
- unverified `American English` — editorial rule, no code identifier in the vendor/shopware roots
- unverified `active voice` — editorial rule, no normative code claim to check
- unverified `abbreviations` — editorial rule, no normative code claim to check
