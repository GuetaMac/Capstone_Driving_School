// test-gemini.js
// Save this file and run: node test-gemini.js

const GEMINI_API_KEY = "AIzaSyA6F33Jl7g81CPp3sJY8t8HQHnn5zXT07A";

async function testGemini() {
  console.log("🔍 Testing Gemini API...\n");

  // Test 1: List available models
  console.log("📋 Step 1: Checking available models...");
  try {
    const modelsResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${GEMINI_API_KEY}`
    );

    if (!modelsResponse.ok) {
      const error = await modelsResponse.json();
      console.error("❌ Error listing models:", error);
      return;
    }

    const modelsData = await modelsResponse.json();
    console.log("✅ Available models:");
    modelsData.models.forEach((model) => {
      console.log(`   - ${model.name}`);
    });
    console.log("");

    // Test 2: Try to generate content with first available model
    const firstModel = modelsData.models[0].name;
    console.log(`📝 Step 2: Testing content generation with ${firstModel}...`);

    const generateResponse = await fetch(
      `https://generativelanguage.googleapis.com/${firstModel}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Say hello in 5 words",
                },
              ],
            },
          ],
        }),
      }
    );

    if (!generateResponse.ok) {
      const error = await generateResponse.json();
      console.error(
        "❌ Error generating content:",
        JSON.stringify(error, null, 2)
      );
      return;
    }

    const generateData = await generateResponse.json();
    const response = generateData.candidates[0].content.parts[0].text;
    console.log("✅ Generated response:", response);
    console.log("");
    console.log("🎉 SUCCESS! Your Gemini API is working!");
    console.log(`📌 Use this model in your code: ${firstModel}`);
  } catch (error) {
    console.error("❌ Unexpected error:", error.message);
  }
}

testGemini();
