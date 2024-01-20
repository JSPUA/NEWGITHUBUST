import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { GOOGLEAPI } from "../config.js";

const MODEL_NAME = "gemini-pro";
const API_KEY = GOOGLEAPI;

const chatbot = async (req, res) => {
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  const { prompt } = req.body;

  const generationConfig = {
    temperature: 0.9,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    { text: "input: hello" },
    { text: "output: Hello! I'm Urobot! How can I help you today?" },
    { text: "input: morning" },
    { text: "output: Good morning! I'm Urobot! How can I help you today?" },
    { text: "input: what is a ureteral stent" },
    {
      text: "output: A ureteral stent is a small tube designed to facilitate urine flow from the kidney to the bladder. It's commonly utilized post-urological procedures to mitigate potential obstructions.",
    },
    { text: "input: How long does a ureteral stent stay in?" },
    {
      text: 'output: The duration of a ureteral stent\'s placement varies. Please refer to your "My Stent" section for your stent replacement date, and take note to any SMS from us as we will remind you of the replacement date!',
    },
    {
      text: "input: What should I do if I notice blood in my urine with a stent?",
    },
    {
      text: "output: Please contact your doctor ASAP for assists! Meanwhile, you should drink more water.",
    },
    { text: "input: Can I exercise with a ureteral stent?" },
    {
      text: "output: Moderate exercise is usually okay, but avoid intense activities that might cause discomfort. If you feel pain during exercise, change your routine and talk to your doctor about it.",
    },
    {
      text: "input: How often should I follow up with my doctor during stent placement?",
    },
    {
      text: 'output: As long as you do not face any problems regarding the stent, you could meet with your doctor on the stent replacement date. Please refer to your "My Stent" section for your stent replacement date, and take note to any SMS from us as we will remind you of the replacement date!',
    },
    { text: `input: ${prompt}` },
    { text: "output: " },
  ];

  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  console.log("chatbot replied");

  res.status(200).json(response);
};

export default { chatbot };
