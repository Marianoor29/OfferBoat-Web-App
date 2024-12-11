import React, { createContext, useState, useEffect, ReactNode } from "react";
import { setCookie, destroyCookie, parseCookies } from "nookies";

interface User {
  token?: string | null;
  userType?: string | null;
  profilePicture?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  coverPicture?: string | null;
  location?: string | null;
  rating?: string | null;
  _id?: string | null;
}

interface UserContextProps {
  user: User;
  setUser: (user: User) => void;
  clearUser: () => void;
  updateUser: (updatedFields: Partial<User>) => void;
}

const initialState: User = {
  token: null,
  userType: null,
  profilePicture: null,
  firstName: null,
  lastName: null,
  email: null,
  phoneNumber: null,
  coverPicture: null,
  location: null,
  rating: null,
  _id: null,
};

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User>(initialState);

  useEffect(() => {
    // Load user data from cookies on initial load
    const { userInfo } = parseCookies();
    if (userInfo) {
      const parsedData: User = JSON.parse(userInfo);
      setUserState(parsedData);
    }
  }, []);

  const setUser = (newUser: User) => {
    setUserState(newUser);
    // Save user data in cookies
    setCookie(null, "userInfo", JSON.stringify(newUser), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };

  const clearUser = () => {
    setUserState(initialState);
    destroyCookie(null, "userInfo", { path: "/" });
  };

  const updateUser = (updatedFields: Partial<User>) => {
    const updatedUser = {
      ...user,
      ...updatedFields,
      token: updatedFields.token !== undefined ? updatedFields.token : user.token,
    };
    setUserState(updatedUser);
    setCookie(null, "userInfo", JSON.stringify(updatedUser), {
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
    });
  };
  
  
  return (
    <UserContext.Provider value={{ user, setUser, clearUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
