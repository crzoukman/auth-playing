import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Context, axiosWith } from "../App";
import { Verification } from "./Verification";
import { AxiosError } from "axios";

export const Register = () => {
  const [formData, setFormData] = useState({
    login: "fucker",
    password: "fucker",
    rePassword: "fucker",
  });
  const { isAuth, verified, setIsAuth } = useContext(Context);
  const [error, setError] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    const id = e.target.id;
    const data = { ...formData, [id]: value };
    data.login = data.login.toLowerCase();

    setFormData(data);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axiosWith
      .post("/register", formData)
      .then(() => {
        setIsAuth(true);
      })
      .catch((e) => {
        console.log(e);
        if (e instanceof AxiosError) {
          if (e.response) {
            setError(e.response.data.message);
          }
        }
      });
  };

  if (isAuth && !verified) return <Verification />;

  return (
    <>
      <form id="form" onSubmit={onSubmit}>
        <input
          id="login"
          placeholder="login"
          type="text"
          onChange={onChange}
          value={formData.login}
        />
        <input
          id="password"
          placeholder="password"
          type="password"
          onChange={onChange}
          value={formData.password}
        />
        <input
          id="rePassword"
          placeholder="rePassword"
          type="password"
          onChange={onChange}
          value={formData.rePassword}
        />
      </form>
      <button type="submit" form="form">
        Register
      </button>
      {error && <div>{error}</div>}
    </>
  );
};
