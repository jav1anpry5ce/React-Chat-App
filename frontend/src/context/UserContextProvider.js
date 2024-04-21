import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const getUpdateUser = async (user) => {
    if (!user?.token) return;

    const uUser = await axios.get(`https://api.chatapp.home/api/user`, {
      headers: {
        Authorization: `${user.token}`
      }
    });
    if (!uUser) return;
    const updatedUser = {
      ...uUser.data,
      token: user.token
    };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const updateUser = (user) => {
    const oldUser = JSON.parse(localStorage.getItem("user"));
    const updatedUser = {
      ...user,
      token: oldUser.token
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const handleUserData = (data) => {
    if (!user) return;

    if (
      user.name === data.name &&
      user.image === data.image &&
      user?.id === data?.id
    ) {
      return;
    }

    const updatedUser = {
      ...user,
      id: data.id
    };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  const clearUser = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    getUpdateUser(user);
  }, []);

  return (
    <UserContext.Provider
      value={{ user, setUser, updateUser, handleUserData, clearUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
