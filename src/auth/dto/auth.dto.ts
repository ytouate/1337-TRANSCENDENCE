import { IsEmail, IsNotEmpty, IsString, isString } from "class-validator";

export class AuthDto {

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
    
}