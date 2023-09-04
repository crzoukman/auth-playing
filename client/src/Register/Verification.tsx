import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Context, axiosWith } from "../App";
import { useNavigate } from "react-router-dom";

export const Verification = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const { setVerified } = useContext(Context);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    axiosWith
      .post("/code", { code })
      .then(() => {
        setVerified(true);
        navigate("/admin");
      })
      .catch((e) => console.log(e));
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.trim());
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>Enter the code: </label>
        <input type="text" value={code} onChange={onChange} />
        <button type="submit">Send</button>
      </form>
    </>
  );
};
