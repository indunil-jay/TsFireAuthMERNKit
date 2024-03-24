import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

//test  end point
app.get("/test", (req, res) => {
  res
    .status(200)
    .json({ status: "success", message: "test end point is working.." });
});

export default app;
