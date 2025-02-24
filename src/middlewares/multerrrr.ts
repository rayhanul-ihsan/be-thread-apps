var multer = require('multer')
var storage = multer.diskStorage({


destination: function(req, file, callback) { 
    callback(null, './uploads');
  },
  filename: function(req, file, callback) {
    console.log(file);
    if(file.originalname.length>6)
      callback(null, file.fieldname + '-' + Date.now() + file.originalname.substr(file.originalname.length-6,file.originalname.length));
    else
      callback(null, file.fieldname + '-' + Date.now() + file.originalname);

  }
});