import React, { FC, createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type User = {
  id: string;
  phoneNumber: string;
  name: string;
  email: string;
  profilePicture: string;
  role: string;
};

const GlobalContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoadingUser: boolean;
  setIsLoadingUser: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  user: null,
  setUser: () => {},
  isLoadingUser: true,
  setIsLoadingUser: () => {},
});

const ContextProvider: FC<Props> = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);
  return (
    <GlobalContext.Provider
      value={{ user, setUser, isLoadingUser, setIsLoadingUser }}
    >
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => React.useContext(GlobalContext);

export { ContextProvider, useGlobalContext };
