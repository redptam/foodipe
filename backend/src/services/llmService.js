import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

// Create OpenAI instance if key available
let openai;
if (process.env.OPENAI_API_KEY) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export const parseRecipeText = async (unstructuredText) => {
    if (!openai) {
        throw new Error("OpenAI API Key is not configured on the server.");
    }

    if (!unstructuredText || unstructuredText.trim() === '') {
        throw new Error('Recipe text cannot be empty');
    }

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `You are a helpful recipe parsing assistant. 
          Extract the core ingredients and step-by-step instructions from the provided unstructured recipe text.
          You must provide a suggested 'name' for the recipe based on its content.
          Return ONLY a JSON object with this exact structure:
          {
            "name": "Suggested Recipe Name",
            "ingredients": [
              { "name": "Ingredient 1", "amount": "Quantity 1" },
              { "name": "Ingredient 2", "amount": "Quantity 2" }
            ],
            "instructions": [
              "Step 1 text here",
              "Step 2 text here"
            ]
          }`
                },
                {
                    role: "user",
                    content: unstructuredText
                }
            ]
        });

        const parsedContent = JSON.parse(response.choices[0].message.content);
        return parsedContent;
    } catch (error) {
        console.error("LLM Parsing error:", error);
        throw new Error("Failed to parse recipe via LLM");
    }
};
