const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // Find the user
  const user = await User.findById(req?.user?.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  let requestLimit = 0;

  // Determine the request limit based on trial or subscription
  if (user?.trialActive) {
    if (!user?.monthlyRequestCount) {
      throw new Error("Monthly request count is not defined for trial users");
    }
    requestLimit = user?.monthlyRequestCount; // Trial users have a default limit of 100
  } else if (user?.subscriptionPlan === "Free") {
    requestLimit = 3;
  } else if (user?.subscriptionPlan === "Basic") {
    requestLimit = 50; 
  } else if (user?.subscriptionPlan === "Premium") {
    requestLimit = 100; 
  } else {
    throw new Error("No valid plan or trial found ");
  }

  // Check if the user has exceeded their monthly request count
  if (user?.apiRequestCount == null) {
    throw new Error("API request count is not defined for the user");
  }

  if (user?.apiRequestCount >= requestLimit) {
    return res.status(403).json({
      message: "You have reached your API request limit. Please upgrade your plan to continue.",
    });
  }

  console.log(`User ID: ${user?._id}, API Requests: ${user?.apiRequestCount}, Limit: ${requestLimit}`);

  next();
});

module.exports = checkApiRequestLimit;