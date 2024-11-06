import express from "express";
import { getUserById, getUsers } from "./user.service";
import { isAuthenticate } from "../../../middlewares";
import { cacheMiddleware } from "../../../middlewares/cache.middleware";
import { createResponses, handleResponse } from "../../../helpers/response";

const router = express.Router();
const response = createResponses('user');

router.get('/', 
  isAuthenticate,
  cacheMiddleware({ 
    ttl: 300, // 5 minutes
    keyPrefix: 'users' 
  }),
  async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1;
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const users = await getUsers(page, limit);
      handleResponse(res, { status: 200, message: "Users fetched successfully", data: users });
    } catch (error) {
      next(error);
    }
  }
);

router.get('/:id', 
  isAuthenticate, 
  cacheMiddleware({ 
    ttl: 300, 
    keyPrefix: 'user' 
  }),
  async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);
    handleResponse(res, { status: 200, message: "User fetched successfully", data: user });
  } catch (error) {
    next(error);
  }
});

export default router;
