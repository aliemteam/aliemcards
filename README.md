[![Build Status](https://travis-ci.org/aliemteam/aliemcards.svg?branch=master)](https://travis-ci.org/aliemteam/aliemcards) [![codecov](https://codecov.io/gh/aliemteam/aliemcards/branch/master/graph/badge.svg)](https://codecov.io/gh/aliemteam/aliemcards)

# ALIEM Cards

This repository contains the original markdown source for all the ALIEM Cards as well as the simple API providing the cards to a ReactJS frontend website.

**Contents**

1. [Card Format](#card-format)
2. [Website Build Details](#aliem-cards-website)
3. [API Documentation](#api-documentation)

## Build a Card

Within the `cards` folder, each card lives in its own folder. The name of the folder is the unique identifier for that card. Consider merely naming the file based on the title of the card in most cases.

Each card folder name must:

1. be unique
2. contain no spaces ( `-` can be used)
3. be descriptive

Within each card folder there must be a file named `card.md`. This is the actual text of the card.

Any image files, videos or other resources relevant to the card can be placed in this folder. File names must contain no spaces either.

A simple example structure:

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


### Card File

Cards are formatted in [Github-Flavored Markdown](https://guides.github.com/features/mastering-markdown/). They include [YAML](http://www.yaml.org) front matter, similar to [Jekyll](https://jekyllrb.com/docs/frontmatter/).


#### Front Matter

The front matter is a simple [YAML](http://www.yaml.org) block beginning and ending with three tick marks: `---`.

Within the tick marks are three key-value pairs:

- **title**: the title of the card, in single quotes
- **authors**: a list of authors. Each author is on Eer/his own indented line, beginning with a hyphen, in single quotes.
- **created**: the date the card was created, formatted `YYYY/MM/DD`.
- **updates**: a list of dates in reverse chronological order, formatted `YYYY/MM/DD`. List format same as **authors**. Do not include the date the card was created.
- **categories**: a list of categories to which each card belongs. Cards can belong to more than one category. Each category is on its own indented line, beginning with a hyphen, use single quotes around names with spaces or special characters.
- **drugs**: a comma-separated list of drugs.


**Sample YAML Front Matter**

```
---

title: 'Adenosine 6-12-12 Approach'
authors:
    - 'Brian Hayes, PharmD'
created: 2012/12/06
updates:
    - 2012/12/06
categories:
    - Cardiovascular
    - Pharmacology
    - 'Critical Care'
drugs: adenosine

---
```

### Building the Site and Data Store

The cards are processed using [Gulp](http://gulpjs.com). There is a `gulpfile.js` in the main directory contains the code to run this task. The `package.json` includes scripts to run the various development and production builds, as per usual.

The gulp task runs through each markdown file, processes the frontmatter and creates a master `data.json` file. That data forms the basis for the [GraphQL](http://graphql.org/) API.

The build process also uploads images to the [Amazon Web Service CDN Cloudfront](https://aws.amazon.com/). This build step requires the [AWS CLI](https://aws.amazon.com/cli/) and is run via a bash script `awsbuild.sh`.


## ALiEM Cards Website

### Frontend

The `app` folder contains the necessary pieces for a [ReactJS](https://facebook.github.io/react/)-based frontend. This is a simple [ReactJS](https://facebook.github.io/react/) website that makes ajax calls to the GraphQL API.

The `assets` folder contains static assets, e.g. images, css files, etc. Various style components have been broken out, and [Stylus](http://stylus-lang.com) is used as a CSS pre-processor.

### Backend

The `index.js` file in the root folder contains the [ExpressJS](https://expressjs.com) server that powers the site.

The `server` folder contains the primary backend resources for the website, primarily schema files for GraphQL and the [Normalizr](https://github.com/paularmstrong/normalizr) helper library.

### OpenShift

The website is hosted on the [OpenShift](https://www.openshift.com) free tier. This hosting platform allows deployment via git. Management is done via their command-line tool.

This command will provide shell access to the server console:

```
rhc ssh aliemcards
```

OpenShift has been added to the git repository as another remote, in this case titled `openshift`. After updates are made to the main respository, changes can be pushed via:

```
git push openshift HEAD
```

## API Documentation

GraphQL info here.
