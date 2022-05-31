import { UserDetails } from "src/utils/types";
import { User } from 'src/users/entities/user.entity'

export interface AuthenticationProvider
{
    validateUser(details: UserDetails);
    createUser(details: UserDetails);
    findUser(login42: string): Promise<User> | undefined;
}