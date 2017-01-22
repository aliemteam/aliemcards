[![Build Status](https://travis-ci.org/aliemteam/aliemcards.svg?branch=master)](https://travis-ci.org/aliemteam/aliemcards) [![codecov](https://codecov.io/gh/aliemteam/aliemcards/branch/master/graph/badge.svg)](https://codecov.io/gh/aliemteam/aliemcards)

# ALIEM Cards

This repository contains the original markdown source for all the ALIEM Cards as well as the simple API providing the cards to a ReactJS frontend website.

**Contents**

1. [Card Format](#card-format)
2. [Website Build Details](#aliem-cards-website)
3. [API Documentation](#api-documentation)



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
