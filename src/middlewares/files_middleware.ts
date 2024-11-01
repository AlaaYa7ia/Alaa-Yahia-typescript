const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (
    req: any,
    file: any,
    cb: (arg0: null, arg1: string) => void
  ) {
    cb(null, "uploads/");
  },
  filename: function (
    req: any,
    file: { originalname: any },
    cb: (arg0: null, arg1: any) => void
  ) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
