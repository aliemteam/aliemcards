const AWS = require('aws-sdk');

// AWS Defaults for this app
AWS.config.update({ region: 'us-west-2' });
const s3 = new AWS.S3({ params: { Bucket: 'aliem-cards-beta' } });

// Barebones Upload params example
// {
//   Key: 'test2.png',
//   Body: fs.readFileSync('image.png'), // string or Buffer
//   ContentType: 'image/png',
//   ACL: 'public-read', // permissions
// }
function uploadPromise(params = {}) {
  return new Promise((res, rej) => {
    s3.upload(params, (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
}

function listObjectsPromise(params = {}) {
  return new Promise((res, rej) => {
    s3.listObjectsV2(params, (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
}

function deleteObjectsPromise(params = {}) {
  return new Promise((res, rej) => {
    s3.deleteObjects(params, (err, data) => {
      if (err) rej(err);
      res(data);
    });
  });
}

function emptyBucketPromise(params = {}) {
  return listObjectsPromise(params)
    .then(data => {
      const deleteArr = data.Contents.map(obj => ({ Key: obj.Key }));
      return deleteObjectsPromise({ Delete: { Objects: deleteArr } });
    });
}

module.exports = {
  uploadPromise,
  listObjectsPromise,
  deleteObjectsPromise,
  emptyBucketPromise,
  cfurl: 'http://d1ls5t977au33f.cloudfront.net',
};
