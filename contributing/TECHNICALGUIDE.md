# Techinical Guide

# Card structure

Each ALiEM Card is a collection of text and image files, used to serve the website and eventually an external API. Browse the `demo-card` folder here or the main `cards` folder and you can get a good idea for how the cards are built.

# Build a Card

Each card lives in its own folder or directory. The name of the folder is the unique identifier for that card. In most cases, the folder should merely be named based on the title of the card.

Each card folder name **must**:

1. be unique
2. contain no spaces ( `-` may be used)
3. be descriptive
4. use only lowercase letters

Within each card folder there **must** be a file named `card.md`. This is the actual text of the card, written following recommendations from the [Style Guide](STYLEGUIDE.md) and [Markdown Guide](MARKDOWNGUIDE.md).

Any image files, videos or other resources relevant to the card can be placed in this folder. Those file names must not contain spaces either.

A simple example showing how two cards might be structured:

```
cards
  |
  ├── unique-card-title
  |    |
  |    ├──- card.md
  |    |
  |    ├──- image-1.png
  |    |
  |    └─── image-2.gif
  |
  └─── a-different-card-title
       |
       ├──- card.md
       |
       └───  image-1.jpg
```


# Card File

Cards are formatted in [Github-Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They include [YAML](http://www.yaml.org) front matter, similar to [Jekyll](https://jekyllrb.com/docs/frontmatter/).


# Front Matter

Every `card.md` file **must** begin with YAML Frontmatter. This is a common convention, and is modeled after the [Jekyll](https://jekyllrb.com/docs/frontmatter/) static site generator.

The front matter is a simple [YAML](http://www.yaml.org) block beginning and ending with three tick marks: `---`. 

Within the tick marks are three key-value pairs:

| Key           | Value     |
|---------------|-----------|
| **title**         | the title of the card, in single quotes |
| **authors**       | a list of authors. Each author is on her/his own indented line, beginning with a hyphen, in single quotes |
| **created**       | the date the card was created, formatted `YYYY/MM/DD` |
| **updates**       | a list of dates in reverse chronological order, formatted `YYYY/MM/DD`, list format same as **authors**, do not include the date the card was created |
| **categories**    | a list of categories to which each card belongs. Cards can belong to more than one category. Each category is on its own indented line, beginning with a hyphen, use single quotes around names with spaces or special characters |
| **drugs**         | a comma-separated list of drugs, wrapped in single quotes   |
| **litreview**     | a search string from [PubMed](https://www.ncbi.nlm.nih.gov/pubmed/) or [Google Scholar](https://scholar.google.com/), in single quotes. *This is a new feature and existing cards will not have this field, but it should be added as part of any updates* |


## Sample YAML Front Matter

```
---

title: 'Adenosine 6-12-12 Approach'
authors:
    - 'Brian Hayes, PharmD'
    - 'Michelle Lin, MD'
created: 2012/12/06
updates:
    - 2015/04/11
    - 2013/07/02
categories:
    - Cardiovascular
    - Pharmacology
    - 'Critical Care'
drugs: 'adenosine, diltiazem'
litreview: 'Therapy/Broad[filter] AND (("adenosine"[MeSH Terms] OR "adenosine"[All Fields]) AND svt[All Fields])'

---
```