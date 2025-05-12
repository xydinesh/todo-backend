import router from "./routes";
import express from "express";

const app = express();
app.use(express.json());

app.use("/api/items", router);

export default app;
