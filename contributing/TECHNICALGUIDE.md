# Techinical Guide

This guide contains instructions on creating cards. There is also information on the GitHub workflow, including adding cards, editing cards, and tracking issues.

## Card structure

Each ALiEM Card is a collection of text and image files, used to serve the website and eventually an external API. Browse the `demo-card` folder here or the main `cards` folder and you can get a good idea for how the cards are built.

## Build a Card

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


## Card File

Cards are formatted in [Github-Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They include [YAML](http://www.yaml.org) front matter, similar to [Jekyll](https://jekyllrb.com/docs/frontmatter/).


## Front Matter

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


### Sample YAML Front Matter

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

## GitHub Workflow

The ALiEM Cards project, including the cards and their website, are managed using a typical GitHub workflow. If you are familiar with this you can fork the repository, commit changes, and submit a pull request as usual.

If that was a meaningless foreign language to you, please read on.

### Git & GitHub

[Git](https://git-scm.com/) is a [version control system](https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control), a way to track changes to a set of files over times. Git is now the most popular tool for version control. 

[GitHub](https://www.github.com) is a different service. It is a web platform that is a version control repository. Distributed teams with lots of contributors can use Git to store their projects on GitHub. It includes various features to help track contributions, issues, and other things teams need.

Nearly all the features of Git, and GitHub, including directly editing files, are available via the GitHub website. This is a convenient and easy way to contritube.

To contribute to ALiEM Cards you will need a GitHub account. Please register if you have not done so already.

### Some Vocabulary

There are some important terms to understand when working with Git. Some terms may seem unclear, but like learning a new game, once you start using them, it will be second nature.

**Commit**. A `commit` is like saving a file. It marks a point in the version of the project that can be returned to. You might change a single file, or multiple files, and then `commit` a snapshot of your project afterward. 

**Branch**. Versions of the project can be split into branches. If a developer wants to try some new feature, he can create a new branch of the code, eg `new-feature`, without affecting the `master` branch. He can add, delete or change files. This branch can have multiple `commits`. Then, when satisfied with his new feature or changes, that branch can be `merged` into the `master` branch.

**Merge**. A `merge` is the term for pulling one branch into another.

**Pull Request**. A `pull request` is a mechanism for notifying a team that you want one of your `branches` pulled into one of the project `branches`. 

### An Example

With that vocabulary in mind, here is an example scenario for working with the cards.

1. I notice an error in a card, eg a medication dose that needs to be changed.
2. I create a new branch: `medication-patch`.
3. I edit the card, fixing the dose error, save the file and create a new `commit`.
4. I make a `pull request` notifying the team that I want my `medication-patch` pulled into the `master` branch of the project.
5. The team can make comments on the changes. Additional changes and commits can be made to the `medication-patch`.
6. Once the changes are approved they can be `merged` into the master branch.

### The GitHub Way

Luckily for us, GitHub has a way to manage all these steps via the website.


