const multer = require('multer');
const fs = require('fs');
const path = require('path');

function buildMulterMiddleware(config) {
  const uploadDir = config.tempDir || './temp_uploads';

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueName = `${Date.now()}-${file.originalname}`;
      cb(null, uniqueName);
    }
  });

  return multer({ storage }).single('file');
}

module.exports = { buildMulterMiddleware };
