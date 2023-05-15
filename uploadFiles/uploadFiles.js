const multer = require("multer");

// MULTER STORAGE
class UploadFiles {
  paths = {
    video: "public/videos",
    img: "public/img/posts",
    users: "public/img/users",
    messageImg: "public/message/img",
    messageVd: "public/message/videos",
  };

  constructor(type) {
    this.type = type;
    this.multerStorageMethod();
  }

  multerStorageMethod() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.paths[this.type]);
      },
      filename: (req, file, cb) => {
        const ext = file.mimetype.split("/")[1];
        cb(null, `${this.type}-${Date.now()}.${ext}`);
      },
    });

    const filter = (req, file, cb) => {
      if (this.type === "video" && !file.mimetype.startsWith("video")) {
        cb(new Error("Only video files are allowed!"), false);
        return;
      } else if (this.type === "img" && !file.mimetype.startsWith("image")) {
        cb(new Error("Only image files are allowed!"), false);
        return;
      }
      cb(null, true);
    };

    this.upload = multer({ storage, fileFilter: filter });
  }
}

module.exports = UploadFiles;
