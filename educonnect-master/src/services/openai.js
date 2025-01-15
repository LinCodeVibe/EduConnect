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

    Here is an example of a response:
    Here’s a 1-week personalized study plan to master derivatives, limits, and integrals. The plan assumes about 2-3 hours of daily study time. Adjust as needed based on your schedule and familiarity with the topics.
Day 1: Foundations of Limits

    Objective: Understand the concept of limits and basic computations.
    Topics:
        Definition of limits and notation.
        Evaluating limits graphically and numerically.
        Limit laws.
        One-sided limits and limits at infinity.
    Tasks:
        Watch a video/lecture (e.g., Khan Academy or YouTube) on the basics of limits.
        Solve 10-15 basic limit problems (both numerical and graphical).
        Read about the epsilon-delta definition (optional for extra rigor).
    Resources:
        “Limits and Continuity” chapter in your textbook or online platforms.

Day 2: Advanced Limits and Continuity

    Objective: Tackle harder limit problems and explore continuity.
    Topics:
        Indeterminate forms and L'Hôpital's Rule.
        Continuity and its relationship to limits.
        Limits involving infinity and asymptotes.
    Tasks:
        Solve 10-15 problems on L’Hôpital’s Rule and limits involving infinity.
        Study continuity and practice problems on identifying where functions are discontinuous.
        Review your mistakes from Day 1 and clarify concepts.
    Resources:
        Practice from a calculus workbook or online problem sets.

Day 3: Introduction to Derivatives

    Objective: Grasp the concept of derivatives and basic techniques.
    Topics:
        Definition of the derivative as a limit.
        Rules of differentiation: power, product, quotient, chain rules.
        Differentiability and continuity.
    Tasks:
        Watch a video on the definition of derivatives and differentiation rules.
        Solve 15 basic derivative problems (polynomials, trigonometric, exponential).
        Write down real-world applications of derivatives (e.g., velocity, slopes).
    Resources:
        Exercises on differentiation rules from your preferred calculus source.

Day 4: Advanced Derivatives

    Objective: Work on higher-order derivatives and applications.
    Topics:
        Implicit differentiation.
        Higher-order derivatives.
        Applications: Tangent lines, rates of change.
    Tasks:
        Solve 10 problems on implicit differentiation.
        Solve 5-10 problems involving tangent lines and higher-order derivatives.
        Review key derivative rules and revisit mistakes from Day 3.
    Resources:
        Advanced problems from textbooks

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
