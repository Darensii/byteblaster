import express from "express";
import cors from "cors";
import fs from "fs";
import { OpenAI } from "openai";

const app = express();
const port = process.env.PORT || 3005;
const apiKey = process.env.OPEN_AI_KEY;
const openai = new OpenAI({ apiKey: apiKey });

app.use(cors());
app.use(express.json());

app.post("/chatbot", async (req, res) => {
  const { question } = req.body;

  try {
      let response;

      // Check if combined question is available
      const fileContent = await fs.readFileSync('UTS_Information.txt', 'utf8');
      const combinedQuestion = `${question}\n${fileContent}`;

      if (fileContent.trim() !== '') {
          // Use combined question if available
          response = await openai.chat.completions.create({
              messages: [
                  {
                      role: "system",
                      content: "You are an AI Assistant which develop by the student from University of Technology Sarawak based on the OpenAI. Your main role is to help find any relevant information and the Timetable on the website of the school.",
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
          // No combined question available, use only user question
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
      res.status(500).send("Internal Server Error"); // Handle error gracefully
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));