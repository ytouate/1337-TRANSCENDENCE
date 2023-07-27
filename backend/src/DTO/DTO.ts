import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class ChatDto {
    @IsString()
    @IsNotEmpty()
    public roomName: string;
  
    @IsString()
    @IsEmail({}, { each: true }) // Apply IsEmail validator to each element of the array
    @IsNotEmpty()
    public email: string[];
  
    @IsString()
    @IsNotEmpty()
    public status: string;
  
    @IsString()
    @MinLength(4)
    @MaxLength(10)
    @Matches(/^(?=.*\d)(?=.*\W+)(?=.*[A-Z])(?=.*[a-z]).{10,}$/, {
      message: 'Password too weak. It must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 10 characters long.',
    })
    public password: string;
  
    @IsString()
    @IsNotEmpty()
    public data: string;
  }

export class twoFatctor {
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email: string
}

export class code {

    @IsNotEmpty()
    @IsString()
    @MaxLength(5)
    @MinLength(5)
    public code : string
}

export class message {
    @IsString()
    @IsNotEmpty()
    public roomName: string;

    @IsString()
    @IsEmail()
    public data : string

    @IsNotEmpty()
    @IsString()
    @IsEmail({}, { each: true }) // Apply IsEmail validator to each element of the array yes hh
    public email: string[];
}