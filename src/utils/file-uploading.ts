import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { FileExtensionNotAllowedException } from '../exceptions/file-extension-not-allowed.exception';

type validMimeType = 'application/pdf';

const validMimeTypes: validMimeType[] = ['application/pdf'];

export const saveDocumentToStorage = {
  storage: diskStorage({
    destination: './public/uploads/documents',
    filename: (req, file, cb) => {
      const fileExtension: string = extname(file.originalname);
      const fileName: string = uuidv4() + fileExtension;
      cb(null, fileName);
    },
  }),
  fileFilter: (req, file, cb) => {
    validMimeTypes.includes(file.mimetype)
      ? cb(null, true)
      : cb(new FileExtensionNotAllowedException());
  },
};
