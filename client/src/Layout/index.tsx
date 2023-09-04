import { FC, PropsWithChildren, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context, axiosWith } from "../App";

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  const { isAuth, verified, setIsAuth, setVerified } = useContext(Context);
  const navigate = useNavigate();

  const logoutHandler = () => {
    axiosWith
      .post("/logout")
      .then(() => {
        setIsAuth(false);
        setVerified(false);
        navigate("/");
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      {isAuth && verified && (
        <div>
          <div>
            <NavLink to="/admin">Admin</NavLink>
          </div>

          <div>
            <NavLink to="/protected">Protected</NavLink>
          </div>
        </div>
      )}

      {!verified && (
        <div>
          <div>
            <NavLink to="/">Login</NavLink>
          </div>

          <div>
            <NavLink to="/register">Register</NavLink>
          </div>
        </div>
      )}

      {verified && (
        <>
          <div></div>
          <button onClick={logoutHandler}>Log out</button>
        </>
      )}

      <div>{children}</div>
    </>
  );
};
