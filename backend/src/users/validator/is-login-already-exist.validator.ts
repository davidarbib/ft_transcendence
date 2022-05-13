import {
    registerDecorator, 
    ValidationArguments, 
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { ObjectIdColumn } from "typeorm";
import { User } from "../entities/user.entity";
import { UsersService } from "../users.service";

@ValidatorConstraint({ async:true})
export class isLoginNotExistingConstraint implements ValidatorConstraintInterface
{
    validate(login: string ){
        return User.findOne({ where : {login}}).then(user =>
            {
                if (user) return false
                return true;
            });
        
    }
}
export function IsLoginlNotExisting()
{
    return function (object: Object, propertyName : string){
        registerDecorator({
            target : object.constructor,
            propertyName : propertyName,
            validator: isLoginNotExistingConstraint,
               });
    }
}