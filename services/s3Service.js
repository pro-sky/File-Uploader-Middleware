const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

const upload = async (file, s3Config) => {
  const {
    accessKeyId,
    secretAccessKey,
    region,
    bucket,
    baseKey = 'uploads/'
  } = s3Config;

  // Configure AWS SDK
  const s3 = new AWS.S3({
    accessKeyId,
    secretAccessKey,
    region
  });

  const fileStream = fs.createReadStream(file.path);

  const key = `${baseKey}${Date.now()}-${file.originalname}`;

  const params = {
    Bucket: bucket,
    Key: key,
    Body: fileStream,
    ContentType: file.mimetype
  };

  return new Promise((resolve, reject) => {
    s3.upload(params, (err, data) => {
      if (err) return reject(err);

      resolve({
        message: 'File uploaded to S3',
        s3Url: data.Location,
        key: data.Key,
        bucket: data.Bucket
      });
    });
  });
};

module.exports = { upload };
