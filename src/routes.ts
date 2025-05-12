import { Router } from "express";

import { CreateItem, GetItems } from "./controllers";

const router = Router();

router.get("/", GetItems);
router.post("/", CreateItem);

export default router;
