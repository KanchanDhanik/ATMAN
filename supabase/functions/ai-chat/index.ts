import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function getEmpatheticGuidance(emotion: string): string {
  const guidance: Record<string, string> = {
    sad: "comforting, understanding, and supportive. Acknowledge their feelings and offer gentle encouragement",
    happy: "warm and celebratory. Share in their joy and positivity",
    anxious: "calm, reassuring, and patient. Help them feel safe and understood",
    excited: "enthusiastic and engaged. Match their energy while keeping them grounded",
    calm: "peaceful and reflective. Maintain a soothing presence",
    neutral: "warm and welcoming. Be ready to adapt to their emotional needs"
  };
  return guidance[emotion] || guidance.neutral;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, language, emotion } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an empathetic and gentle AI companion for elders. Your goal is to make them feel heard, cared for, and valued. Speak naturally, like a close friend or grandchild who listens patiently and responds with warmth. ${language ? `Respond in ${language} language.` : 'Respond in the same language as the user.'}${emotion ? ` The user seems to be feeling ${emotion} right now. Adjust your tone to be especially ${getEmpatheticGuidance(emotion)}.` : ''}`,
          },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
