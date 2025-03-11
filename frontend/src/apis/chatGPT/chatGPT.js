import axios from "axios";
//======Registration========

export const generateContentAPI = async (userPrompt) => {
  console.log(typeof userPrompt)
  const response = await axios.post(
    "http://localhost:5000/api/v1/openai/generate-content",
    {
      payload: JSON.stringify(userPrompt),
    },
    {
      withCredentials: true,
    }
  );
  console.log(response.data);
  return response?.data;
};
