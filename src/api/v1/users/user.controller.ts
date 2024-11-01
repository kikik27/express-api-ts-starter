import express from "express";
import { getUsers } from "./user.service";
import { isAuthenticate } from "../../../middlewares";
import { createResponses } from "../../../helpers/response";

const router = express.Router();
const response = createResponses('user')

router.get('/', isAuthenticate, async (req, res) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const users = await getUsers(page, limit);
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(response.error(error));
  }
});

export default router;
