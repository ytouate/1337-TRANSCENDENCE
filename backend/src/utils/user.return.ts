

export function userReturn(user: any , req: any){
    if (user?.imageIsUpdate && user.urlImage) user.urlImage = req.protocol + "://" + req.get('host') + "/profile/getphoto/" + user.username;
    const {imageIsUpdate, ...result} = user;
    return result;
  }