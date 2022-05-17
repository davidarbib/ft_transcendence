import {
    registerDecorator, 
    ValidationArguments, 
    ValidatorConstraint,
    ValidatorConstraintInterface
} from "class-validator";
import { User } from "../entities/user.entity";

@ValidatorConstraint({ async:true})
export class isEMailNotExistingConstraint implements ValidatorConstraintInterface
{
    validate(mail: string ){
        return User.findOne({ where : {mail}}).then(user =>
            {
                if (user) return false
                return true;
            });
        
    }
}

export function IsEmailNotExisting()
{
    return function (object: Object, propertyName : string){
        registerDecorator({
            target : object.constructor,
            propertyName : propertyName,
            validator: isEMailNotExistingConstraint,
               });
    }
}