const { S3Client } = require('@aws-sdk/client-s3');

function getEnv(name, fallback) {
  const v = process.env[name];
  if (v === undefined || v === null || v === '') return fallback;
  return v;
}

// Uses standard AWS SDK env vars if present.
const region = getEnv('AWS_REGION', 'us-east-1');

// Credentials are expected via env vars (AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY)
// or IAM role / shared config in the deployment environment.
// Passing credentials explicitly is optional; this keeps it compatible with multiple setups.

const s3 = new S3Client({
  region,
});

module.exports = { s3, bucketName: getEnv('S3_BUCKET_NAME', '') };

