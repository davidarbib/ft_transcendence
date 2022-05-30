import { diskStorage } from "multer";
import * as path from 'path';
//import path from 'path'
//import path = require('path')
import {v4 as uuidv4} from 'uuid'


type  ValidFileExtension = 'png | jpg | jpeg ';
type ValidMimeTYpe = 'image/png' |'image/jpg' | 'image/jpeg ';

const validFileExtension  : ValidFileExtension[] = [ 'png | jpg | jpeg '];
const validMimeTYpe  : ValidMimeTYpe[] = [ 'image/png' , 'image/jpg' , 'image/jpeg ',];

export const Imagestorage = {

    storage : diskStorage({
    destination: './uploads/profile-image',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name + uuidv4()
      const ext :string = path.parse(file.originalname).ext;
      cb(null,`${filename}${ext}`);
    }
}),
filter: (req, file, cb) => {

    const allowMimeType: ValidMimeTYpe[] = validMimeTYpe;
    allowMimeType.includes(file.mimetype) ? cb(null ,true) : cb(null, false);
},
};