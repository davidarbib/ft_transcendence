import { Controller, Post } from '@nestjs/common';
import { createDataService } from './createData.service';
@Controller('createData')
export class createDataController {
    constructor (private readonly createdataService: createDataService){}
    
     @Post()
     postcreateData()
     {
         console.log("create data");
         this.createdataService.insertdata();
     }
}