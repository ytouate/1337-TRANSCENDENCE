import { IsIn, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class PrefDto {
    @IsNotEmpty()
    @IsInt()
    userId: number;

    @IsNotEmpty()
    @IsString()
    ballColor: string;

    @IsNotEmpty()
    @IsString()
    paddleColor: string;

    @IsNotEmpty()
    @IsString()
    mapTheme: string;
}
