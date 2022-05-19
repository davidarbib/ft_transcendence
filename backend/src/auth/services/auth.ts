export interface AuthenticationProvider
{
    validateUser();
    createUser();
    findUser();
}