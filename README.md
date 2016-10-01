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

### API Endpoints

Method  | URL               | Action
--------|-------------------|-------------------------------------
GET     | /cards            | Retrieve all cards.
GET     | /cards/:slug      | Retrieve card with specific slug.
GET     | /sections         | Retrieve all sections.
GET     | /sections/:slug   | Retrieve sections with specific slug.
GET     | /search/:term     | Retrieve cards based on search term.
GET     | /tags             | Retrieve all tags and their associated cards' slugs.
GET     | /tags/:slug       | Retrieve all tags with specific slug and their associated cards' slugs
