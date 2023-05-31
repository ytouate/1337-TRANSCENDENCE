export declare const InterfacePfoileServiceProvider = "InterfacePfoileServiceProvider";
export interface IProfileService {
    getProfile(req: any): any;
    updatePhoto(req: any, filePath: any): any;
    deletePhoto(req: any): any;
    updateName(newUsername: any, req: any): any;
}
