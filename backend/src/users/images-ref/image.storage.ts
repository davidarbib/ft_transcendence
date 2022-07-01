import { diskStorage } from "multer";
import * as path from 'path';
//import path from 'path'
//import path = require('path')
import {v4 as uuidv4} from 'uuid'


type ValidMimeTYpe = 'image/png' |'image/jpg' | 'image/jpeg ';

const validMimeTYpe  : ValidMimeTYpe[] = [ 'image/png' , 'image/jpg' , 'image/jpeg ',];

export const Imagestorage = {

    storage : diskStorage({
    destination: 'public',
    filename: (req, file, cb) => {
      const filename: string = path.parse(file.originalname).name + uuidv4()
      const ext :string = path.parse(file.originalname).ext;
      cb(null,`${filename}${ext}`);
    }
    })
  }