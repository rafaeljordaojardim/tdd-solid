import { Router } from "express";
import { adaptRoute } from "../adapters/express-route-adapter";
import { makeSingupController } from "../factories/signup";

export default (router: Router) => {
  router.post('/signup', adaptRoute(makeSingupController()))
}