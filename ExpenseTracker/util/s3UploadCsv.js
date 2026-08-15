// util/s3UploadCsv.js
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const uploadCsvAndGetPresignedUrl = async ({ key, csv, contentType }) => {

  const bucketName = process.env.AWS_BUCKET_NAME;
  const regionName = process.env.AWS_REGION || "ap-south-1";

  if (!bucketName) {
        throw new Error("AWS_BUCKET_NAME is missing or undefined in your .env file!");
  }

    // 1. Initialize the v3 S3 client
    const s3Client = new S3Client({
        region: regionName,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
    });

    try {
        // 2. Upload the file using PutObjectCommand (replaces s3.upload)
        const uploadParams = {
            Bucket: bucketName,
            Key: key,
            Body: csv,
            ContentType: contentType || "text/csv",
        };
        await s3Client.send(new PutObjectCommand(uploadParams));

        // 3. Generate a pre-signed download URL valid for 15 minutes
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: key,
        });
        
        const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
        return signedUrl;

    } catch (error) {
        console.error("AWS S3 V3 CORE UPLOAD CRASH:", error);
        throw new Error(`AWS S3 Upload Failed: ${error.message}`);
    }
};

module.exports = { uploadCsvAndGetPresignedUrl };