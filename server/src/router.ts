import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

interface USER {
  id: number;
  login: string;
  password: string;
  verified: boolean;
}

const JWT_SECRET = "!dsn17g8#19hv7_1xas&";

const DB = {
  id: 0,
  USERS: [
    { id: -1, login: "test", password: "test", verified: true },
  ] as USER[],
  ADD_USER: function (user: Omit<USER, "id">) {
    const id = this.id++;
    DB.USERS.push({ id, ...user });
    return { id, login: user.login, verified: user.verified };
  },
};

router.get("/check", (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: " User is not logged in" });
  }

  const decoded = jwt.verify(token, JWT_SECRET);

  return res.status(200).json(decoded);
});

router.post("/register", (req, res) => {
  const { login, password, rePassword } = req.body;

  const user = DB.USERS.find((user) => user.login === login);

  if (user && user.verified)
    return res.status(409).json({ message: "User already exists" });
  if (user && !user.verified)
    return res.status(422).json({ message: "User exists but is not verified" });

  if (password !== rePassword)
    return res.status(400).json({ message: "Passwords do not match" });

  const created = DB.ADD_USER({ login, password, verified: false });

  const token = jwt.sign(created, JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.header("Access-Control-Allow-Credentials", "true");

  return res.status(200).json(created);
});

router.post("/code", (req, res) => {
  const { code } = req.body;
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: " User is not logged in" });
  }

  if (code !== "123") {
    return res.status(401).json({ message: "Code is not valid" });
  }

  const decoded = jwt.verify(token, JWT_SECRET) as { login: string };
  const user = DB.USERS.find((user) => user.login === decoded.login);

  if (!user) {
    res.clearCookie("token");
    return res.status(401).json({ message: " User is not logged in" });
  }

  user.verified = true;

  const newToken = jwt.sign({ ...decoded, verified: true }, JWT_SECRET);

  res.cookie("token", newToken, {
    httpOnly: true,
  });

  res.header("Access-Control-Allow-Credentials", "true");

  return res.status(204).json({});
});

router.post("/login", (req, res) => {
  const { login, password } = req.body;

  const user = DB.USERS.find((user) => user.login === login);

  if (!user || password !== user.password) {
    return res
      .status(401)
      .json({ message: "User does not exist or password is incorrect" });
  }

  const userData = { id: user.id, login: user.login, verified: user.verified };

  const token = jwt.sign(userData, JWT_SECRET);

  res.cookie("token", token, {
    httpOnly: true,
  });

  res.header("Access-Control-Allow-Credentials", "true");

  return res.status(200).json(userData);
});

router.post("/logout", (req, res) => {
  const { token } = req.cookies;

  res.clearCookie("token");

  if (!token) {
    return res.status(401).json({ message: " User is not logged in" });
  }

  return res.status(204).json({});
});

export default router;
