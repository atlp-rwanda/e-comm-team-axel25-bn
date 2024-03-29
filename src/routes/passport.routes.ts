import { Request, Response, Router } from "express";
import passport from "passport";
import { googleLogin } from "../controllers/googleAuth.controller";

const passportRouter = Router();

// authentication pages with a link to log in (this rout is here for testing only)
passportRouter.get("/googleAuth", (req: Request, res: Response) => {
  res.send('<a href="/api/v1/auth/google">Use Google To login</a>');
});

// 🍀 this is the actual route that will be hit so as to login with google. 🍀
passportRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] }),
);

// This is where a user will be redirected after signing in with google
passportRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/",
    failureRedirect: "/auth/google/failure",
  }),
);

passportRouter.post("/auth/google-login", googleLogin);

export default passportRouter;
