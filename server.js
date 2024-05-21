import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3005;
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

const staticPath = path.join(__dirname, 'dist');
app.use(express.static(staticPath));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.post("/chatbot", async (req, res) => {
  const { question } = req.body;

  try {
      let response;
      const fileContent = fs.readFileSync(path.join(__dirname, 'UTS_Information.txt'), 'utf8');
      const combinedQuestion = `${question}\n${fileContent}`;

      if (fileContent.trim() !== '') {
          response = await openai.chat.completions.create({
              messages: [
                  {
                      role: "system",
                      content: "You are an AI Assistant developed by the students from University of Technology Sarawak based on the OpenAI. Your main role is to help find any relevant information and the Timetable on the website of the school.",
                  },
                  {
                      role: "user",
                      content: combinedQuestion,
                  },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 300,
          });
      } else {
          response = await openai.chat.completions.create({
              messages: [
                  {
                      role: "system",
                      content: "I am an AI CHATBOT of UTSCalendar. Please search something related to UTS.",
                  },
                  {
                      role: "user",
                      content: question,
                  },
              ],
              model: "gpt-3.5-turbo",
              max_tokens: 300,
          });
      }
      res.send(response.choices[0].message.content);

  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(staticPath, 'index.html'));
});

app.listen(port, () => console.log(`Server running on port ${port}`));