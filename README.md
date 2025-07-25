# 📦 sujeet_file-uploader

<div align="center">

**A powerful, pluggable file upload middleware for Node.js Express applications**

</div>

---

## ✨ Features

🎯 **Smart Storage Options** - Upload to Amazon S3 or local filesystem with seamless switching  
🛡️ **Built-in Security** - File type validation and secure temporary storage via multer  
⚡ **Express Integration** - Clean, middleware-based integration with Express.js routes  
🔧 **Highly Configurable** - Extensive configuration options for different use cases  
📁 **Temporary Management** - Automatic temporary file handling with cleanup options  

---

## 🚀 Quick Start

### Installation

```bash
npm install sujeet_file-uploader
```

### Basic Setup

```javascript
const express = require('express');
const { configureUploader } = require('sujeet_file-uploader');

const app = express();

// 🔧 Configure your uploader
const uploader = configureUploader({
  destination: 's3', // 's3' or 'local'
  allowedExtensions: ['.zip', '.pdf', '.jpg', '.png'],
  tempDir: './tmp',
  
  // S3 Configuration
  s3: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
    bucket: process.env.AWS_BUCKET_NAME,
    baseKey: 'uploads/'
  }
});

// 📤 Create upload endpoint
app.post('/upload', uploader.middleware, async (req, res) => {
  try {
    const result = await uploader.handleUpload(req.file);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

app.listen(3000, () => {
  console.log('🚀 Server running on port 3000');
});
```

---

## ⚙️ Configuration Reference

### Core Configuration

| Option | Type | Description | Default | Required |
|--------|------|-------------|---------|----------|
| `destination` | `string` | Storage destination: `'s3'` or `'local'` | - | ✅ |
| `allowedExtensions` | `string[]` | Allowed file extensions | - | ✅ |
| `tempDir` | `string` | Temporary upload directory | `'./temp_uploads'` | ❌ |
| `maxFileSize` | `number` | Maximum file size in bytes | `10MB` | ❌ |

### Amazon S3 Configuration

```javascript
s3: {
  accessKeyId: 'your-access-key',      // AWS Access Key ID
  secretAccessKey: 'your-secret-key',  // AWS Secret Access Key
  region: 'us-east-1',                 // AWS Region
  bucket: 'your-bucket-name',          // S3 Bucket Name
  baseKey: 'uploads/',                 // Optional: Key prefix for uploads
  acl: 'public-read'                   // Optional: S3 ACL permissions
}
```

### Local Storage Configuration

```javascript
local: {
  dest: './uploads',           // Destination folder
  preserveOriginalName: false  // Keep original filename (default: false)
}
```

---

## 📊 Response Examples

### ✅ Successful S3 Upload

```json
{
  "success": true,
  "data": {
    "message": "File uploaded successfully to S3",
    "s3Url": "https://your-bucket.s3.amazonaws.com/uploads/1690230293-document.pdf",
    "key": "uploads/1690230293-document.pdf",
    "bucket": "your-bucket",
    "size": 1024576,
    "mimetype": "application/pdf",
    "originalName": "document.pdf"
  }
}
```

### ✅ Successful Local Upload

```json
{
  "success": true,
  "data": {
    "message": "File uploaded successfully to local storage",
    "path": "./uploads/1690230293-document.pdf",
    "filename": "1690230293-document.pdf",
    "size": 1024576,
    "mimetype": "application/pdf",
    "originalName": "document.pdf"
  }
}
```

### ❌ Error Response

```json
{
  "success": false,
  "error": "File type not allowed. Allowed types: .zip, .pdf, .jpg, .png"
}
```

---

## 🔧 Advanced Usage

### Multiple File Types with Different Configurations

```javascript
// For document uploads
const documentUploader = configureUploader({
  destination: 's3',
  allowedExtensions: ['.pdf', '.doc', '.docx'],
  s3: { /* S3 config */ }
});

// For image uploads
const imageUploader = configureUploader({
  destination: 'local',
  allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif'],
  local: { dest: './images' }
});

app.post('/upload/documents', documentUploader.middleware, async (req, res) => {
  // Handle document uploads
});

app.post('/upload/images', imageUploader.middleware, async (req, res) => {
  // Handle image uploads
});
```

### Environment Variables Setup

Create a `.env` file:

```bash
# AWS Configuration
AWS_ACCESS_KEY=your_aws_access_key_here
AWS_SECRET_KEY=your_aws_secret_key_here
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Application
NODE_ENV=production
PORT=3000
```

### Frontend Integration

#### HTML Form

```html
<form action="/upload" method="post" enctype="multipart/form-data">
  <input type="file" name="file" accept=".pdf,.zip,.jpg,.png" required>
  <button type="submit">Upload File</button>
</form>
```

#### JavaScript (Fetch API)

```javascript
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch('/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Upload successful:', result.data);
    } else {
      console.error('❌ Upload failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
};
```

---

## 🧪 Testing

### cURL Examples

```bash
# Upload a PDF file
curl -X POST http://localhost:3000/upload \
  -F "file=@./document.pdf" \
  -H "Accept: application/json"

# Upload with verbose output
curl -X POST http://localhost:3000/upload \
  -F "file=@./archive.zip" \
  -v
```

### Unit Testing Setup

```javascript
const request = require('supertest');
const app = require('./app'); // Your Express app

describe('File Upload', () => {
  test('should upload PDF file successfully', async () => {
    const response = await request(app)
      .post('/upload')
      .attach('file', './test/fixtures/sample.pdf')
      .expect(200);
      
    expect(response.body.success).toBe(true);
    expect(response.body.data.s3Url).toBeDefined();
  });
});
```

---

## 🛡️ Security Best Practices

- ✅ **File Type Validation** - Always specify `allowedExtensions`
- ✅ **File Size Limits** - Set appropriate `maxFileSize` limits
- ✅ **Environment Variables** - Store AWS credentials securely
- ✅ **Temporary Cleanup** - Implement automatic temp file cleanup
- ✅ **Input Sanitization** - Validate file names and paths
- ✅ **Access Control** - Configure proper S3 bucket permissions

---

## 🐛 Troubleshooting

### Common Issues

**Error: "AWS credentials not found"**
```bash
# Ensure environment variables are set
export AWS_ACCESS_KEY=your_key
export AWS_SECRET_KEY=your_secret
```

**Error: "File type not allowed"**
```javascript
// Check your allowedExtensions configuration
allowedExtensions: ['.pdf', '.zip'] // Include the dot!
```

**Error: "Cannot create directory"**
```bash
# Ensure proper permissions
chmod 755 ./uploads
mkdir -p ./temp_uploads
```

---

## 🗺️ Roadmap

- [ ] **v2.0** - Multiple file uploads support
- [ ] **v2.1** - Virus scanning integration (ClamAV)
- [ ] **v2.2** - Upload progress tracking with WebSockets
- [ ] **v2.3** - Automatic temp file cleanup
- [ ] **v2.4** - Comprehensive logging and monitoring hooks
- [ ] **v2.5** - Google Cloud Storage support
- [ ] **v2.6** - Image processing and resizing

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with ❤️ using [Multer](https://github.com/expressjs/multer)
- Powered by [AWS SDK](https://aws.amazon.com/sdk-for-javascript/)
- Inspired by the Express.js community

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

[Report Bug](https://github.com/your-org/file-uploader/issues) · [Request Feature](https://github.com/your-org/file-uploader/issues) · [Documentation](https://github.com/your-org/file-uploader/wiki)

</div>