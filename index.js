const { buildMulterMiddleware } = require('./middleware/upload');
const fileValidator = require('./utils/fileValidator');
const s3Service = require('./services/s3Service');
const localService = require('./services/localService');

function configureUploader(config) {
  if (!config) throw new Error('Uploader configuration is required');
  if (!config.allowedExtensions || !Array.isArray(config.allowedExtensions)) {
    throw new Error('You must specify allowedExtensions as an array');
  }

  const middleware = buildMulterMiddleware(config);

  const handleUpload = async (file) => {
    fileValidator(file, config.allowedExtensions);

    if (config.destination === 's3') {
      if (!config.s3 || !config.s3.bucket) {
        throw new Error('S3 configuration is missing');
      }
      return await s3Service.upload(file, config.s3);
    } else {
      return await localService.save(file, config.local);
    }
  };

  return {
    middleware,
    handleUpload
  };
}

module.exports = {
  configureUploader
};
