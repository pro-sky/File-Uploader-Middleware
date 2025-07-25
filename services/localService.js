const fs = require('fs');
const path = require('path');

const save = async (file, config = {}) => {
  const destDir = config.dest || './uploads';
  // Ensure destination folder exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const destPath = path.join(destDir, `${Date.now()}-${file.originalname}`);

  return new Promise((resolve, reject) => {
    fs.rename(file.path, destPath, (err) => {
      if (err) return reject(err);

      resolve({
        message: 'File uploaded locally',
        path: destPath,
        filename: path.basename(destPath),
      });
    });
  });
};

module.exports = { save };
