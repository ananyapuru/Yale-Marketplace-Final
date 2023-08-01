import jwt_decode from "jwt-decode";
import { getToken } from "../services/auth.service";

export default function checkUser(){
    if (getToken() !== null){
        const token = getToken()
        const decodedToken = jwt_decode(token)
        if (decodedToken.exp * 1000 > Date.now()){
            return true
        }
    }
    return false
}