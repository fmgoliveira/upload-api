const express = require('express');
const multer = require('multer');
const path = require('path');
var cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { appUrl, appPort } = require('./config.json');

const app = express();
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const fileId = uuidv4();
    const ext = path.extname(file.originalname);
    cb(null, fileId + ext);
  }
});
const upload = multer({ storage });

app.use(cors());

app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  const fileId = path.parse(file.filename).name;
  const fileUrl = `${appUrl}/uploads/${fileId}${path.extname(file.originalname)}`;
  res.json({ url: fileUrl });
});

app.get('/uploads/:fileId', (req, res) => {
  const fileId = req.params.fileId;
  const filePath = path.join(__dirname, 'uploads', `${fileId}`);
  res.sendFile(filePath);
});

app.listen(appPort || 3000, () => {
  console.log('Server is running on port ' + `${appPort}` || `3000`);
});
