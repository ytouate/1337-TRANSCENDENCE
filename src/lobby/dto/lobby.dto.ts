import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class LobbyDto {
    @IsNotEmpty()
    @IsString()
    lobbyName: string;

    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsInt()
    userId: number;
}
