const tags = require('./build_api/sections/tags');
const Tag = require('./build_db/models/taxonomy').tag;

const test = new Tag({ title: 'Test Tag' });
test.save();
console.log(`Test Tag Slug: ${test.slug}`);

const numTags = Object.keys(tags).length;

console.log('Number of tags: '+ numTags);
