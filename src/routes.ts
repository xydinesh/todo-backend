import { Router } from "express";

import {
  CreateItem,
  GetItems,
  GetItemById,
  DeleteItemByID,
  UpdateItemById,
} from "./controllers";

const router = Router();

router.post("/", CreateItem);
router.get("/", GetItems);
router.get("/:id", GetItemById);
router.put("/:id", UpdateItemById);
router.delete("/:id", DeleteItemByID);

export default router;
