// upload.js
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValidType = allowedTypes.test(file.mimetype);
  if (isValidType) {
    cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
