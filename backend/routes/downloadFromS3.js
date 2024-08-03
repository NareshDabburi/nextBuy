const express = require("express");
const router = express.Router();
const {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const fs = require("fs");
const path = require("path");
const stream = require("stream");
const { promisify } = require("util");

const pipeline = promisify(stream.pipeline);

// Configure the AWS SDK with your credentials and region
const bucketName = process.env.AWS_S3_BUCKET_NAME;
const bucketRegion = process.env.AWS_S3_BUCKET_REGION;
const accessKey = process.env.AWS_S3_ACCESS_KEY;
const secretAccessKey = process.env.AWS_S3_ACCESS_SECRET;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

const prefix = "productImages/";
const localFolder = path.join(__dirname, "../../uploads");
// Ensure the local folder exists
if (!fs.existsSync(localFolder)) {
  fs.mkdirSync(localFolder);
}

const downloadFile = async (bucket, key, downloadPath) => {
  const params = {
    Bucket: bucket,
    Key: key,
  };

  const command = new GetObjectCommand(params);
  const response = await s3.send(command);

  await pipeline(response.Body, fs.createWriteStream(downloadPath));
  //console.log(`Downloaded ${key} to ${downloadPath}`);
};

const listObjects = async (bucket, continuationToken = null) => {
  const params = {
    Bucket: bucket,
    Prefix: prefix,
    ContinuationToken: continuationToken,
  };
  const command = new ListObjectsV2Command(params);
  const data = await s3.send(command);

  const downloadPromises = data.Contents.map((object) => {
    const imageName = object.Key;
    const splitImageName = imageName.split("/");
    const fileName = splitImageName[splitImageName.length - 1];
    const downloadPath = path.join(localFolder, fileName);
    return downloadFile(bucket, object.Key, downloadPath);
  });

  await Promise.all(downloadPromises);

  if (data.IsTruncated) {
    await listObjects(bucket, data.NextContinuationToken);
  }
};

router.get("/", async (req, res) => {
  try {
    await listObjects(bucketName);
    res.status(200).send("Images downloaded successfully");
  } catch (error) {
    console.error("Error downloading images:", error);
    res.status(500).send("Error downloading images");
  }
});
module.exports = router;
