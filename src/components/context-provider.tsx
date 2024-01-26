import React, { FC, createContext, useState } from "react";

type Props = {
  children: React.ReactNode;
};

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
};

const GlobalContext = createContext<{
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}>({
  user: null,
  setUser: () => {},
});

const ContextProvider: FC<Props> = (props: Props) => {
  const [user, setUser] = useState<User | null>(null);
  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {props.children}
    </GlobalContext.Provider>
  );
};

const useGlobalContext = () => React.useContext(GlobalContext);

export { ContextProvider, useGlobalContext };
