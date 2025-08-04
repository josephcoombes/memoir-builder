"use server"

import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import type { Memory } from "@/app/page"

// Create OpenAI client with explicit API key
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateMemoryDraft(prompt: string, response: string, tone: string): Promise<string> {
  // Check if API key is available and valid
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes("your-openai-api-key") ||
    process.env.OPENAI_API_KEY.includes("your-ope")
  ) {
    console.log("Using fallback response - no valid API key found")
    return getFallbackResponse(response, tone)
  }

  const toneInstructions = {
    warm: "Write in a warm, gentle, and comforting tone. Use soft language that feels like a loving embrace.",
    honest: "Write in a direct, authentic, and straightforward tone. Be genuine and real without being harsh.",
    poetic: "Write in a lyrical, beautiful, and evocative tone. Use rich imagery and metaphorical language.",
    humorous: "Write in a light, playful, and gently funny tone. Find the joy and lightness in the memory.",
    raw: "Write in an unfiltered, real, and emotionally honest tone. Don't shy away from difficult feelings.",
  }

  const systemPrompt = `You are a skilled memoir writer helping someone craft their personal memories into beautiful prose. 

Your task is to take their raw memory response and transform it into a well-written memoir-style passage. 

Guidelines:
- ${toneInstructions[tone as keyof typeof toneInstructions]}
- Keep it personal and intimate
- Preserve the authenticity of their experience
- Use sensory details they provided
- Write in first person
- Keep it concise but meaningful (2-4 paragraphs)
- Don't add details they didn't provide
- Focus on the emotional truth of the memory

The original prompt was: "${prompt}"
Their response: "${response}"

Transform this into a beautiful memoir passage.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Please write this memory as a memoir passage in a ${tone} tone.`,
    })

    return text
  } catch (error) {
    console.error("Error generating memory draft:", error)
    return getFallbackResponse(response, tone)
  }
}

export async function generateChapterIntroduction(
  title: string,
  description: string,
  memories: Memory[],
): Promise<string> {
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes("your-openai-api-key") ||
    process.env.OPENAI_API_KEY.includes("your-ope")
  ) {
    return `This chapter, "${title}", brings together memories that share a common thread in the tapestry of my life. ${description ? description + " " : ""}Each story here represents a moment that helped shape who I am today.

As I look back on these experiences, I'm struck by how they connect to form a larger narrative about growth, change, and the beautiful complexity of being human. These memories, when woven together, tell a story that's uniquely mine.`
  }

  const memoryDescriptions = memories
    .map((m, index) => `${index + 1}. ${m.prompt}: ${m.response.substring(0, 100)}...`)
    .join("\n")

  const systemPrompt = `You are a skilled memoir writer creating chapter introductions. Your task is to write a compelling introduction that:

1. Sets the emotional tone for the chapter
2. Connects the memories thematically
3. Provides context for why these memories belong together
4. Uses a reflective, memoir-style voice
5. Is 2-3 paragraphs long
6. Feels personal and authentic

Write in first person and maintain a warm, reflective tone that draws the reader into the chapter.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Write a chapter introduction for "${title}".
      
Chapter description: ${description || "No specific description provided"}

The chapter contains these memories:
${memoryDescriptions}

Create an introduction that weaves these memories together thematically and emotionally.`,
    })

    return text
  } catch (error) {
    console.error("Error generating chapter introduction:", error)
    return `This chapter, "${title}", brings together memories that share a common thread in the tapestry of my life. ${description ? description + " " : ""}Each story here represents a moment that helped shape who I am today.

As I look back on these experiences, I'm struck by how they connect to form a larger narrative about growth, change, and the beautiful complexity of being human. These memories, when woven together, tell a story that's uniquely mine.`
  }
}

export async function generateTransition(fromMemory: Memory, toMemory: Memory): Promise<string> {
  if (
    !process.env.OPENAI_API_KEY ||
    process.env.OPENAI_API_KEY.includes("your-openai-api-key") ||
    process.env.OPENAI_API_KEY.includes("your-ope")
  ) {
    return "Looking back now, I can see how one experience led to another, each memory building upon the last in the ongoing story of my life."
  }

  const systemPrompt = `You are a skilled memoir writer creating smooth transitions between memories within a chapter. Your task is to:

1. Create a natural bridge between two memories
2. Maintain narrative flow and emotional continuity
3. Keep it concise (1-2 sentences)
4. Use a reflective, memoir-style voice
5. Connect themes, emotions, or lessons between the memories
6. Write in first person

The transition should feel natural and help the reader move smoothly from one memory to the next.`

  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Create a transition between these two memories:

FIRST MEMORY:
Prompt: ${fromMemory.prompt}
Response: ${fromMemory.response}

SECOND MEMORY:
Prompt: ${toMemory.prompt}
Response: ${toMemory.response}

Write a brief, natural transition that connects these memories.`,
    })

    return text
  } catch (error) {
    console.error("Error generating transition:", error)
    return "Looking back now, I can see how one experience led to another, each memory building upon the last in the ongoing story of my life."
  }
}

function getFallbackResponse(response: string, tone: string): string {
  const fallbackResponses = {
    warm: `The memory comes back to me like a gentle wave - ${response.toLowerCase()}. There's something so tender about how our minds hold onto these moments, keeping them safe like treasures in a secret box. This memory feels like a warm embrace from the past, reminding me of the beauty that exists in the simple moments of being alive.

Each time I revisit this memory, I'm struck by how it continues to shape who I am. It's woven into the fabric of my being, a thread that connects my past self to who I've become. There's comfort in knowing that some experiences stay with us, becoming part of our inner landscape.`,

    honest: `I remember this clearly: ${response}. It's funny how some memories stick with us while others fade away. This one has stayed, and I think that means something. It's part of who I am now, part of my story.

Sometimes the most important memories are the ones that feel ordinary but carry extraordinary meaning. They're the moments that, when we look back, we realize were actually turning points or simply beautiful instances of being human. This memory is one of those - simple, real, and somehow essential to understanding my journey.`,

    poetic: `Like light filtering through leaves, this memory dances in my mind: ${response}. It blooms in the garden of remembrance, a delicate flower that time cannot wither. Each detail is a brushstroke on the canvas of my past, painting a picture of who I was in that moment, suspended in time like a photograph of the soul.

In the quiet chambers of memory, this moment lives on, breathing with the rhythm of remembrance. It speaks in whispers of who I was, who I am, and who I might become. Such is the poetry of our lived experience - each memory a verse in the epic poem of our existence.`,

    humorous: `Oh, this takes me back! ${response}. Isn't it funny how our brains work? Of all the things I could remember - important dates, where I put my keys, the names of people I met five minutes ago - this is what stuck. But I'm glad it did; it makes me smile even now.

There's something wonderfully human about the memories we keep, the little moments that somehow become the big ones in the story of our lives. If our memories were a highlight reel, this would definitely make the cut - not because it was earth-shattering, but because it was perfectly, beautifully ordinary.`,

    raw: `This memory cuts through me: ${response}. No sugar-coating, no pretty words to dress it up. It happened, and it mattered, and it's part of me now. Sometimes memories are like that - they don't ask permission to stay, they just do. And maybe that's exactly how it should be.

The truth is, this memory has weight. It carries something real, something that shaped me in ways I'm still figuring out. I won't pretend it was all beautiful or all painful - it just was. And in that rawness, in that unfiltered reality, there's something honest about the human experience that I can't ignore.`,
  }

  return fallbackResponses[tone as keyof typeof fallbackResponses] || fallbackResponses.warm
}
