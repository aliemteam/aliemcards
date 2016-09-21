# ALIEM Cards

This repository contains the original markdown source for all the ALIEM Cards.

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
