import app from "./app";
import dotenv from "dotenv";
// https://blog.logrocket.com/express-typescript-node/
dotenv.config();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
