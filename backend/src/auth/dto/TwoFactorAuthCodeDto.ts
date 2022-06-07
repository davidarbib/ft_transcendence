import { IsString, Length } from 'class-validator';
export class TwoFactorAuthCodeDto {

    @IsString()
    @Length(6, 6)
    code: string;

}
