
export const InterfacePfoileServiceProvider = 'InterfacePfoileServiceProvider' 
export interface IProfileService{
    getProfile(req);
    updatePhoto(req,  filePath);
    deletePhoto(req);
    updateName(newUsername, req);
}