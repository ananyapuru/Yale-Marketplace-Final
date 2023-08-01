export function logout() {
    document.cookie.split(";").forEach((c) => {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
}

function getCookie(name) {
    const return_string = document.cookie.split(';')
            .map(cookie => cookie.trim())
            .find(cookie => cookie.startsWith(`${name}=`))
            ?.split('=')[1];
    if (return_string) {
        return return_string
    }
    return null;
}

export function getUserId(){
    return getCookie('user_id')
}

export function getToken() {
    return getCookie('access_token')
}