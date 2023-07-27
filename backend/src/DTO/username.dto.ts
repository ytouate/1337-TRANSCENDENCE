import { IsNotEmpty, IsString, Length, Matches } from "class-validator";

export class UsernameSearchDto{
    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    @Matches(/^[A-Za-z-]+$/, { message: 'Username not valid.' })
    pattern: string;
}

export class UsernameUpdateDto{
    @IsString()
    @IsNotEmpty()
    @Length(1, 10)
    @Matches(/^[A-Za-z-]+$/, { message: 'Username not valid.' })
    username: string;
}