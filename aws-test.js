const { readFileSync } = require('fs');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });
const s3 = new AWS.S3({ params: { Bucket: 'aliem-cards-beta' } });

const img = readFileSync('./cards-image-fix/acls/image-1.png');

s3.upload({
  Key: 'test2.png',
  Body: img,
  ContentType: 'image/png',
  ACL: 'public-read',
},
  (err, data) => {
    if (err) console.log(err);
    console.log(data);
  }
);
