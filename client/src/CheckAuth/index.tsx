import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { Context, axiosWith } from "../App";
import { useLocation, useNavigate } from "react-router-dom";

interface Check_API {
  id: number;
  login: string;
  verified: boolean;
}

const CLOSED_FOR_AUTH_USERS = ["/", "/register"];

export const CheckAuth: FC<PropsWithChildren> = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const navigate = useNavigate();
  const { setVerified, setIsAuth } = useContext(Context);
  const { pathname } = useLocation();

  useEffect(() => {
    axiosWith
      .get<Check_API>("/check")
      .then((res) => {
        const { verified } = res.data;
        setIsAuth(true);

        if (!verified) {
          navigate("/register");
          return;
        }

        setVerified(true);

        if (CLOSED_FOR_AUTH_USERS.includes(pathname)) {
          navigate("/admin");
        }
      })
      .catch((e) => console.error(e))
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  if (isChecking) return <h1>Checking...</h1>;

  return <>{children}</>;
};
