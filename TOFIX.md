# Items to Fix

## Frontend

X alphabetical rows is counterintuitive
X border-radius add
X back button
X loading image
- footer


## Backend

X gulpfile tag/category processing does not remove empty headings already in dbase
- API needs tokenization and authorization based access
  - https://code.tutsplus.com/tutorials/creating-an-api-centric-web-application--net-23417
  - https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens
X Search is not predictive on partial words
- download images from cloudfront and serve locally
  - regex: `/(https?:\/\/.*\.(?:png|jpg))/gi`
  - string.match(regex)[source](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
  - this might help: https://www.npmjs.com/package/gulp-download
