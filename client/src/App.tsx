import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import axios from "axios";
import { Layout } from "./Layout";
import { Admin } from "./Admin";
import { CheckAuth } from "./CheckAuth";
import { createContext, useState } from "react";
import { Protected } from "./Protected";

interface IContext {
  isAuth: boolean;
  verified: boolean;
  setIsAuth: (arg: boolean) => void;
  setVerified: (arg: boolean) => void;
}

export const Context = createContext<IContext>({
  isAuth: false,
  verified: false,
  setIsAuth: () => {},
  setVerified: () => {},
});

const baseURL = "http://localhost:3000";

export const axiosWith = axios.create({
  baseURL,
  withCredentials: true,
});

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [verified, setVerified] = useState(false);

  return (
    <Context.Provider value={{ isAuth, verified, setIsAuth, setVerified }}>
      <CheckAuth>
        <Layout>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/protected" element={<Protected />} />
          </Routes>
        </Layout>
      </CheckAuth>
    </Context.Provider>
  );
}

export default App;
