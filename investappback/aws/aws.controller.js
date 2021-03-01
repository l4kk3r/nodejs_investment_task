var stream = require('stream');
 
const s3 = require('./s3.config.js');
 
exports.doUpload = (req, res) => {
  console.log('I GOT THE FILE!')
  var seconds = new Date().getTime()
  const s3Client = s3.s3Client;
  const params = s3.uploadParams;


  params.Key = `${seconds}_${req.file.originalname}`;
  params.Body = req.file.buffer;
  s3Client.deleteObject
  s3Client.upload(params, (err, data) => {
    if (err) {
      res.status(500).json({error:"Error -> " + err});
    }
    res.json({url: `https://comeinvest.s3.us-east-2.amazonaws.com/${seconds}_${req.file.originalname}`});
  });}