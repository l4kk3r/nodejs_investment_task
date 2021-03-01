let express = require('express');
let router = express.Router();
let upload = require('./multer.config.js');
 
const awsWorker = require('./aws.controller.js');
 
router.post('/api/file/upload', upload.single("file"), awsWorker.doUpload);
 
module.exports = router;