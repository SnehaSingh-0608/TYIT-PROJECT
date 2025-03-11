const express = require("express");
require("dotenv").config();
const usersRouter = require("./routes/usersRouter");
const cors = require("cors");
const { errorHandler } = require("./middlewares/errormiddleware");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const openAIRouter = require("./routes/openAIRouter");
const stripeRouter = require("./routes/stripeRouter");
require("./models/ContentHistory");
const User = require("./models/User");
require("./utils/connectDB")();

const app = express();
const PORT = process.env.PORT || 5000;

//Cron for the trial period:run every single day

cron.schedule("0 0 * * * *", async () => {
  console.log("This runs every second");
  try {
    //get the current date
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 3,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for the free plan : run at the end of every month

cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the basic plan : run at the end of every month

cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for the premium plan : run at the end of every month

cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});
//Cron paid plan

//----middlewares---
app.use(express.json()); //passing incoming json data
app.use(cookieParser()); //pass the cookie automatically

//CORS
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:3001",],
  credentials: true,
};
app.use(cors(corsOptions));

// ------Routes-----
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", openAIRouter);
app.use("/api/v1/stripe", stripeRouter);

//errorhandler middleware
app.use(errorHandler);
// start the server
app.listen(PORT, console.log(`server is running on port ${PORT}`));
