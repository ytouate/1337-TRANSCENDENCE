import { IsInt, IsNotEmpty } from 'class-validator';

export class GameDto {
    @IsNotEmpty()
    @IsInt()
    player1: number;

    @IsNotEmpty()
    @IsInt()
    player2: number;
}
