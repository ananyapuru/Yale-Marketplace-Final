import { getToken } from "./auth.service";

export const getUser = async (userId) => {
  const data = await fetch(`http://localhost:5000/api/user/${userId}`, {
      method: 'GET',
      headers: { Authorization: getToken(), 'Content-Type': 'application/json' },

  })
  const user = await data.json();
  console.log(user)
  return user
}