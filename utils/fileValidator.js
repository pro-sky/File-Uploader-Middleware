const path = require('path');

function fileValidator(file, allowedExtensions = []) {
  if (!file) {
    throw new Error('No file provided');
  }

  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(ext)) {
    throw new Error(`File type not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`);
  }
}

module.exports = fileValidator;
