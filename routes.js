import express from "express";
import multer from "multer";
import { Submission } from "./models/submission.js";
import fs from "fs";
import { addToQueue } from "./queue/send.js";

const app = express();
const upload = multer({ dest: "./uploads" });

app.use(express.json());

var answers = { 1: 100, 2: 200, 3: 300 };

app.post("/validate", (req, res) => {
  const question = req.body.question;
  const solution = answers[question];
  console.log("The solution is: ", solution);
  console.log("The received is: ", req.body.solution);
  res.send(solution == req.body.solution);
});

app.post("/submission", upload.single("code"), async (req, res) => {
  const buffer = fs.readFileSync(`./uploads/${req.file.filename}`);
  try {
    fs.unlinkSync(`./uploads/${req.file.filename}`);
  } catch (error) {
    console.log("error deleting file: ", error);
    res.send({ message: "can't create file", success: false });
  }

  const newSubmission = new Submission(req.body.userId, parseInt(req.body.questionId), buffer);
  console.log("Sending submission to sender");

  try {
    const reply = await addToQueue(newSubmission);
    res.send(JSON.parse(reply));
  } catch (error) {
    console.log("Error: ", error);
    res.send(JSON.parse(error));
  }
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
