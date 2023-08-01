import { getToken } from "./auth.service";

export const getObject = async (object_id) =>{
    const data = await fetch(`http://127.0.0.1:5000/api/object/${object_id}`, {
      method: 'GET',
      // credentials: 'include', // Don't forget to specify this if you need cookies
    //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
    headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
    });
    const object = await data.json();
    return object  
}
  
export const getObjects = async () =>{
    const data = await fetch('http://127.0.0.1:5000/api/objects', {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
    });
    const objects = await data.json();
    return objects  
}
  
  
export const addObject = async (objectData) =>{
    const data = await fetch('http://127.0.0.1:5000/api/addObject', {
        method: 'POST',
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // },
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify(objectData)
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
    });
    const objects = await data.json();
    return objects  
}

export const updateObject = async (objectData, object_id) =>{
    const data = await fetch(`http://127.0.0.1:5000/api/updateObject/${object_id}`, {
        method: 'PUT',
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // },
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify(objectData)
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
    });
    const objects = await data.json();
    return objects  
}


export const addToWishlist = async (object_id, user_id) =>{
    const data = await fetch("http://127.0.0.1:5000/api/addToWishlist", {
        method: 'POST',
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // },
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "user_id": user_id,
            "object_id": object_id
        })
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
    });
    const objects = await data.json();
    return objects  
}
export const getWishlistObjects = async (user_id) =>{
    const data = await fetch(`http://127.0.0.1:5000/api/getWishlist/${user_id}`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
    });
    const objects = await data.json();
    return objects  
}

export const getListingObjects = async (user_id) =>{
    const data = await fetch(`http://127.0.0.1:5000/api/getListing/${user_id}`, {
        method: 'GET',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
    });
    const objects = await data.json();
    return objects  
}

export const deleteFromWishlist = async (object_id, user_id) =>{
    const data = await fetch("http://127.0.0.1:5000/api/deleteFromWishlist", {
        method: 'POST',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "user_id": user_id,
            "object_id": object_id
        })
    });
    const objects = await data.json();
    return objects  
}


export const deleteFromListing = async (object_id, user_id) =>{
    const data = await fetch("http://127.0.0.1:5000/api/deleteFromListing", {
        method: 'POST',
        // credentials: 'include', // Don't forget to specify this if you need cookies
        //   headers: { Authorization: 'Bearer ' + localStorage.getItem("token") }
        headers: { Authorization: getToken(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "user_id": user_id,
            "object_id": object_id
        })
    });
    const objects = await data.json();
    return objects  
}
