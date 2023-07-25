export interface Notification {
    id: number;
    senderId: number;
    description: string;
    title: string;
    reiceverId: number;
    reicever: User;
    time: Date;
}

export interface User {
    id: number;
    email: string;
    username: string;
    urlImage: string;
    imageIsUpdate: Boolean;
    optionalMail?: string;
    codeVerification?: number;
    isSignedIn: Boolean;
    friends: User[];
    friendOf: User[];
    blocked: User[];
    notifications: Notification[];
    status?: string;
    activitystatus: Boolean;
    roomChat: chatRoom[];
    message: Message[];
    preference?: Preference;
    games: Game[];
    win: number;
    loss: number;
    winRate: number;
    winStreak: number;
}

export interface chatRoom {
    id: number;
    roomName: string;
    timeCreate: Date;
    users: User[];
    messages: Message[];
    admins: string[];
    muteUsers: string[];
    banUsers: string[];
    status: string;
    password?: string;
    isDms: boolean;
}

export interface Message {
    id: number;
    data: string;
    time: Date;
    roomId: number;
    userId: number;
    user: User;
    roomData: chatRoom;
}

export interface Preference {
    id: number;
    ballColor: string;
    paddleColor: string;
    mapTheme: string;
    user: User;
    userId: number;
}

export interface Game {
    id: number;
    status: GameStatus;
    players: User[];
    score1: number;
    score2: number;
    winnerId: number;
    createdAt: Date;
    duration: number;
    playerOrder: number;
}

export enum GameStatus {
    FINISHED,
    OUTGOING,
}

export interface Props {
    user: User;
    setSelectedUser(user: User): any;
    createRoom(user: User): any;
    setRoom?(room: chatRoom): any;
}

export interface CurrentChattingUserProps {
    selectedUser: User;
}