import { Route, Navigate, redirect } from "react-router-dom";
import React, {useEffect, useState} from "react";
import jwt_decode from "jwt-decode";
import checkUser from "../common/auth";
import { Outlet } from "react-router-dom";

export default function PrivateRoute({children}) {    

    return(
        <>
        
            {
                checkUser() === false
                ?
                    <Navigate to="/login" replace />
                :
                children
                
                
            }
        </>
    )
};