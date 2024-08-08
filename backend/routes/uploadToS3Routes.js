const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const sharp = require("sharp");
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

//check fileTpe
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb({ message: "Images only!" });
  }
}

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post(
  "/",
  upload.single("image"),
  asyncHandler(async (req, res) => {
    console.log(req.file);
    const fileName = `${req.file.fieldname}-${Date.now()}${path.extname(
      req.file.originalname
    )}`;
    console.log(fileName);

    //const buffer = await sharp(req.file.buffer).toBuffer();

    const buffer = await sharp(req.file.buffer)
      .resize({ height: 1920, widht: 1080, fit: "contain" })
      .toBuffer();

    const params = {
      Bucket: `${bucketName}`,
      Key: `productImages/${fileName}`,
      Body: buffer,
      ContentType: req.file.mimetype,
    };
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);

    console.log("RESPONSE", response);

    if (response.$metadata.httpStatusCode === 200) {
      res.send({
        message: "Image uploaded to S3 successfully",
        //image: `uploads/${fileName}`,
        image: `${process.env.AWS_S3_URL}/${fileName}`,
      });
    } else {
      res.status(500).send({
        message: "Image uploaded to S3 was unsuccessful",
      });
    }
  })
);

module.exports = router;
