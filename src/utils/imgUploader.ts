import path from "path";
import fs from "fs";
import multer from "multer";

export const imgUploader = async (folderName: string) => {
  const uploadPath = path.join(__dirname, `../../public/images/${folderName}`);
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, uploadPath);
    },
    filename(_req, file, callback) => {
      const baseName = file.originalname.split(".")[0];
      const uniqueName = `${Date.now()}-${baseName}.jpg`; // ubah ke jpg
      callback(null, uniqueName);
    },
  });

  return multer({ storage });
};

