const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { openAIController, geminiController } = require("../controllers/openAIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const openAIRouter = express.Router();

openAIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

openAIRouter.post("/test-gemini",isAuthenticated,
  checkApiRequestLimit, geminiController)

module.exports = openAIRouter;
