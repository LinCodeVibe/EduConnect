import axios from "axios";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export const generateStudyPlan = async (subject, duration, focusTopics) => {
  try {
    const prompt = `Create a detailed study plan for ${subject} over a duration of ${duration}.${
      focusTopics ? ` Focus on these topics: ${focusTopics}.` : ""
    }

    Please include:
    1. Weekly breakdown of topics
    2. Daily study goals
    3. Recommended resources
    4. Practice exercises
    5. Milestones and checkpoints

    Format the response in a clear, structured way.`;

    const response = await axios.post(
      OPENAI_API_URL,
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are an experienced educational consultant specializing in creating personalized study plans.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error generating study plan:", error);
    throw new Error("Failed to generate study plan");
  }
};
