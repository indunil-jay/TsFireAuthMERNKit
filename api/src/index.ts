import express from "express";
import fs from "fs";
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log(`app is running on port 3000 ...`);
});
