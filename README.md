# ALIEM Cards

This repository contains the original markdown source for all the ALIEM Cards as well as the simple API providing the cards to a ReactJS frontend website.

## Card Format

Cards are formatted in [Github-Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They include [YAML](http://www.yaml.org) front matter, similar to [Jekyll](https://jekyllrb.com/docs/frontmatter/).

### Front Matter

The front matter is a simple [YAML](http://www.yaml.org) block beginning and ending with three tick marks: `---`.

Within the tick marks are three key-value pairs:

- **title**: the title of the card
- **collection**: a list of categories to which each card belongs. Cards can belong to more than one category. Each category is on its own indented line, beginning with a hyphen.
- **tags**: a comma-separated list of tags. Currently this is primarily used to tag each card with its associated drugs.

**Sample YAML Front Matter**

```
---

title: Acetaminophen toxicity
collection:
  - toxicology
  - pharmacology
tags: acetaminophen, NAQ

---
```



## API Documentation

The API Endpoints return objects with ```status``` and ```data``` properties.

Status  | Meaning
--------|------------
success | Data property contains return objects as detailed below
fail    | Back-end failure, e.g. unable to find specific card slug. Data contains error message.

**api return object**

```
{
  "status": "success",
  "data": [
    {
      "slug": "emergency-drug-card-adult",
      "title": "Emergency Drug Card - Adult"
    },
    {
      "slug": "emergency-drug-card-peds",
      "title": "Emergency Drug Card (Pediatric)"
    }
  ]
}
```

### API Endpoints

Method  | URL               | Action                                    | Return
--------|-------------------|-------------------------------------------|-------
GET     | /cards            | Retrieve all cards.                       | Object with arrays of card_summary objects indexed by card slug
GET     | /cards/:slug      | Retrieve card with specific slug.         | card object
GET     | /categories       | Retrieve all categories and their cards.  | Object with arrays of card_summary objects indexed by slug
GET     | /categories/:slug | Retrieve all cards in specific category.  | Array of card_summary objects
GET     | /search/:term     | Retrieve cards based on search term.      |
GET     | /tags             | Retrieve all tags and their cards.        | Object with arrays of card_summary objects indexed by slug
GET     | /tags/:slug       | Retrieve all cards with specific tag      | Array of card_summary objects

**card object**:
```
{
    "title": "Urinary Tract Infection",
    "slug": "UTI",
    "tags": null,
    "collection": [
      "genitourinary",
      "infectious disease"
    ],
    "content": "Mardown content of the UTI card"
}
```

**card_summary object**:
```
{
    slug: 'card-slug',
    title: 'Card Title'
}
```

**indexed object with arrays of card_summary objects**
```
{

  "Ibuprofen": [
    {
      "slug": "NSAID-GI-bleed",
      "title": "NSAIDs and Upper GI Bleed"
    },
    {
      "slug": "pain-management",
      "title": "Initial Pain Management Options"
    },
    {
      "slug": "urine-tox-screen",
      "title": "Urine Toxicology Screen"
    }
  ],
  "Diclofenac": [
    {
      "slug": "NSAID-GI-bleed",
      "title": "NSAIDs and Upper GI Bleed"
    }
  ]

}
```
