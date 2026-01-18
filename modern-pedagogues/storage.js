const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const localUploadDir = path.join(__dirname, 'uploads');
fs.mkdirSync(localUploadDir, { recursive: true });

const localStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, localUploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({
  storage: localStorage,
  limits: { fileSize: 20 * 1024 * 1024 }
});

const s3Storage = {
  upload: async () => {
    throw new Error('S3 storage not configured.');
  }
};

module.exports = { upload, localUploadDir, s3Storage };
