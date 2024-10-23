import {Express} from "express";
import cookieParser from "cookie-parser";
import auth from "../api/auth/authController";
import users from "../api/users/usersController";
import authorize from "../middlewares/auth";
import game from "../api/game/gameController";


const route = (route: string): string => `/api/${route}`;

const initializeRoutes = (app: Express): void => {
    app.use(cookieParser());

    app.use(route("users"), users);
    app.use(route("auth"), auth);
    app.use(route("games"), authorize, game);
}

export default initializeRoutes;