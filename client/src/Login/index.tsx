import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Context, axiosWith } from "../App";
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios";

interface Login_API {
  id: number;
  login: string;
  verified: boolean;
}

export const Login = () => {
  const [formData, setFormData] = useState({
    login: "fucker",
    password: "fucker",
  });
  const navigate = useNavigate();
  const { setIsAuth, setVerified } = useContext(Context);
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
      .post<Login_API>("/login", formData)
      .then((res) => {
        const { verified } = res.data;

        setIsAuth(true);

        if (!verified) {
          setVerified(false);
          navigate("/register");
          return;
        }

        setVerified(true);
        navigate("/admin");
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
      </form>
      <button type="submit" form="form">
        Login
      </button>
      {error && <div>{error}</div>}
    </>
  );
};
