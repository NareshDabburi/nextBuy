const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const asyncHandler = require("express-async-handler");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");

// Configure AWS SDK
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

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Images only!"));
  }
}

// Configure multer
const storage = multer.memoryStorage(); // In-memory storage
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb); // Validate file type
  },
});

router.post(
  "/",
  upload.array("images", 5),
  asyncHandler(async (req, res) => {
    const imageUrls = [];
    console.log("ENTERED");

    // Check if files exist
    if (!req.files || req.files.length === 0) {
      return res.status(400).send({ message: "No files uploaded." });
    }

    for (const file of req.files) {
      const fileName = `${file.fieldname}-${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}${path.extname(file.originalname)}`;
      console.log("Processing file:", fileName);

      try {
        // Print buffer length to debug if buffers are different
        console.log("Buffer length:", file.buffer.length);

        // Process image with sharp
        const buffer = await sharp(file.buffer)
          .resize({ height: 1920, width: 1080, fit: "contain" }) // Corrected typo
          .flatten({ background: { r: 128, g: 128, b: 128 } }) // Add background color
          .toBuffer();

        // Print processed buffer length to ensure it is being processed
        console.log("Processed buffer length:", buffer.length);

        const params = {
          Bucket: bucketName,
          Key: `productImages/${fileName}`,
          Body: buffer,
          ContentType: file.mimetype, // Use file.mimetype
        };

        const command = new PutObjectCommand(params);
        const response = await s3.send(command);

        console.log("S3 RESPONSE====", response);

        if (response.$metadata.httpStatusCode === 200) {
          imageUrls.push(`${process.env.AWS_S3_URL}/${fileName}`);
        } else {
          console.error("Image upload failed", response);
          return res
            .status(500)
            .send({ message: "Image upload to S3 was unsuccessful." });
        }
      } catch (error) {
        console.error("Error processing file:", error);
        return res.status(500).send({ message: "Error processing file." });
      }
    }

    res.send({
      message: "Images uploaded to S3 successfully",
      image: imageUrls[0],
      images: imageUrls,
    });
  })
);

module.exports = router;
