"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userReturn = void 0;
function userReturn(user, req) {
    if (user.imageIsUpdate && user.urlImage)
        user.urlImage = req.protocol + "://" + req.get('host') + "/profile/getphoto/" + user.username;
    const { email, imageIsUpdate, id } = user, result = __rest(user, ["email", "imageIsUpdate", "id"]);
    return result;
}
exports.userReturn = userReturn;
//# sourceMappingURL=user.return.js.map