📦 @your-org/file-uploader
A pluggable, reusable file upload middleware for Node.js (Express) that supports:

✅ Temporary storage via multer
✅ Upload to Amazon S3 or local disk
✅ File type validation
✅ Clean integration with Express routes

🚀 Installation
npm install @sujeet/file-uploader
📁 Basic Usage
1. Setup uploader in your Express app:
const express = require('express');
const { configureUploader } = require('@sujeet/file-uploader');

const app = express();

// Configure uploader with allowed file types and destination
const uploader = configureUploader({
  destination: 's3', // or 'local'
  allowedExtensions: ['.zip', '.pdf'],
  tempDir: './tmp', // optional temp upload dir

  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
    baseKey: 'uploads/' // optional
  },

  local: {
    dest: './uploads' // destination folder for local uploads
  }
});
2. Define upload route

app.post('/upload', uploader.middleware, async (req, res) => {
  try {
    const result = await uploader.handleUpload(req.file);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
⚙️ Configuration Options
Key	Type	Description	Required
destination	string	's3' or 'local'	✅
allowedExtensions	string[]	Allowed file types (e.g. ['.zip', '.pdf'])	✅
tempDir	string	Temporary storage directory (default: ./temp_uploads)	❌

If using s3:
Key	Type	Description
accessKeyId	string	AWS access key
secretAccessKey	string	AWS secret
region	string	AWS region (e.g. us-east-1)
bucket	string	S3 bucket name
baseKey	string	Prefix path in the bucket

If using local:
Key	Type	Description
dest	string	Final destination folder

📤 Return Payload
On successful upload:

{
  "message": "File uploaded to S3",
  "s3Url": "https://bucket.s3.amazonaws.com/uploads/1690230293-myfile.zip",
  "key": "uploads/1690230293-myfile.zip",
  "bucket": "my-bucket"
}
Or for local:
{
  "message": "File uploaded locally",
  "path": "./uploads/1690230293-myfile.zip",
  "filename": "1690230293-myfile.zip"
}
📂 File Upload Field
The uploader expects a file field in multipart/form-data.

<input type="file" name="file" />
🧼 Temp File Cleanup (Optional)
After successful upload, you can optionally delete the temp file using:

const fs = require('fs');
fs.unlinkSync(req.file.path);
You can integrate this directly in handleUpload() if desired.

🧪 Example Client Request (cURL)

curl -X POST http://localhost:5000/upload \
  -F "file=@./myfile.zip"
📌 TODO / Roadmap
 Multiple file uploads

 Virus scanning support (e.g. ClamAV)

 Upload progress tracking

 Auto-cleanup of temp files

 Logging hooks

📃 License
MIT © Your Name

