const asyncHandler = require("express-async-handler");
const axios = require("axios");
const User = require("../models/User");
const ContentHistory = require("../models/ContentHistory");
const {chatSession} = require("../utils/geminiModel");
const { returnPrompt } = require("../utils/config");
require("dotenv").config();

//--------OpenAI Controller

// const openAIController = asyncHandler(async (req, res) => {
//   const { prompt } = req.body;
//   try {
//     const response = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "gpt-3.5-turbo",
//         prompt,
//         max_tokens: 10,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // Ensure the environment variable name matches
//           "Content-Type": "application/json",
//         },
//       }
//     );
    

//     // Send the response
//     const content = response?.data?.choices[0]?.text?.trim(); // Ensure correct response handling
//     // Create the history
//     const newContent = await ContentHistory.create({
//       user: req?.user?._id,
//       content,
//     });

//     // Push the content into the user
//     const userFound = await User.findById(req?.user?.id);
//     userFound.history.push(newContent?._id);

//     // Update the API request count
//     userFound.apiRequestCount += 1;

//     await userFound.save();
//     res.status(200).json(content);
//     console.log(response.data);
//   } catch (error) {
//     console.error(
//       "Error with OpenAI request:",
//       error.response ? error.response.data : error.message
//     );
//     res.status(500).json({ error: "Failed to generate blog post" });
//   }
// });


const openAIController = asyncHandler(async (req, res) => {
  const { payload } = req.body;
  
  const prompt = returnPrompt(payload);
  if(!prompt){
    res.status(400).json({message: "PROMPT IS REQUIRED"});
    return;
  }
  try {
    const response = await chatSession.sendMessage(prompt);
    

    // Send the response
    const content = response.response.text(); // Ensure correct response handling
    // Create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });

    // Push the content into the user
    const userFound = await User.findById(req?.user?.id);
    userFound.history.push(newContent?._id);

    // Update the API request count
    userFound.apiRequestCount += 1;

    await userFound.save();
    res.status(200).json(content);
    console.log(response.data);
  } catch (error) {
    console.error(
      "Error with OpenAI request:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to generate blog post" });
  }
});


const geminiController = async (req,res) => {
  try{
    const {prompt} = req.body;
    if(!prompt){
      res.status(400).json({message: "PROMPT IS REQUIRED"})
    }
    console.log("PROMPT", prompt)
    const result = await chatSession.sendMessage(prompt);
    // console.log(result);
    const responseText = result.response.text();
    console.log(responseText)
    res.status(200).json(responseText)
    // industryInsights = JSON.parse(responseText.replace('```json', '').replace('```', ''));
    // console.log("Industry insights updated:", industryInsights);

  }catch(e){
    console.log(e);
    res.status(500).json({message: "INTERNAL SERVER ERROR"})
  }
}

module.exports = {
  openAIController,
  geminiController
};
