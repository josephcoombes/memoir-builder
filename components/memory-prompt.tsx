"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react"
import type { UserIntent, Memory } from "@/app/page"
import { generateMemoryDraft } from "@/lib/ai-actions"
import TapestryLogo from "@/components/tapestry-logo"

interface MemoryPromptProps {
  userIntent: UserIntent
  onMemoryAdded: (memory: Memory) => void
  onViewHub: () => void
  memoriesCount: number
}

const memoryPromptsByCategory = {
  childhood: [
    "What's a smell that takes you back to being a child?",
    "Describe your childhood bedroom in detail.",
    "What was your favorite hiding spot as a kid?",
    "Tell me about a toy that meant everything to you.",
    "What's a rule you broke as a child?",
    "Describe a typical Saturday morning when you were young.",
    "What scared you most as a child?",
    "Tell me about your first day of school.",
    "What was your favorite game to play outside?",
    "Describe a family tradition from your childhood.",
    "What's something you collected as a kid?",
    "Tell me about a time you got in trouble.",
    "What was your favorite book or story?",
    "Describe a childhood friend you'll never forget.",
    "What's a food that reminds you of being young?",
  ],
  family: [
    "Tell me about your grandmother's hands.",
    "What's a family story that gets told over and over?",
    "Describe a typical family dinner.",
    "What's something your parent always said?",
    "Tell me about a family vacation or trip.",
    "What's a family recipe that holds memories?",
    "Describe a family celebration or holiday.",
    "What's something you inherited that means a lot to you?",
    "Tell me about a family pet.",
    "What's a family photo that tells a story?",
    "Describe your family's morning routine.",
    "What's a family inside joke or saying?",
    "Tell me about a time your family came together during difficulty.",
    "What's something your family did differently from others?",
    "Describe a relative who influenced you.",
  ],
  love: [
    "Tell me about your first crush.",
    "What's a love letter or note you kept?",
    "Describe the moment you knew you were in love.",
    "What's a song that reminds you of someone special?",
    "Tell me about a first date that mattered.",
    "What's something romantic someone did for you?",
    "Describe a relationship that changed you.",
    "What's a fight you had that brought you closer?",
    "Tell me about saying goodbye to someone you loved.",
    "What's a piece of jewelry or gift that holds love?",
    "Describe a moment of unexpected tenderness.",
    "What's something you learned about love the hard way?",
    "Tell me about a love that didn't work out but taught you something.",
    "What's a way someone showed they cared without words?",
    "Describe a moment when you felt completely understood.",
  ],
  growth: [
    "Tell me about a time you surprised yourself.",
    "What's a mistake that taught you something important?",
    "Describe a moment when you stood up for yourself.",
    "What's something you were afraid of that you overcame?",
    "Tell me about a time you had to be brave.",
    "What's a skill you worked hard to learn?",
    "Describe a moment when you realized you'd grown up.",
    "What's something you believed that you no longer believe?",
    "Tell me about a time you had to start over.",
    "What's a piece of advice that changed your perspective?",
    "Describe a moment when you forgave someone (or yourself).",
    "What's something you're proud of that others might not notice?",
    "Tell me about a time you chose the harder path.",
    "What's a habit you changed that made a difference?",
    "Describe a moment when you realized your own strength.",
  ],
  challenges: [
    "Tell me about a time you felt completely lost.",
    "What's the hardest decision you've ever had to make?",
    "Describe a moment when everything seemed to fall apart.",
    "What's something you had to give up that was important to you?",
    "Tell me about a time you felt like giving up but didn't.",
    "What's a fear you still carry with you?",
    "Describe a moment when you felt misunderstood.",
    "What's something you wish you could do over?",
    "Tell me about a time you disappointed someone you cared about.",
    "What's a challenge that made you who you are today?",
    "Describe a moment when you felt completely alone.",
    "What's something you struggled with that others seemed to find easy?",
    "Tell me about a time when your world changed overnight.",
    "What's a burden you've carried that others don't know about?",
    "Describe a moment when you had to be stronger than you felt.",
  ],
  achievements: [
    "Tell me about a moment when you felt truly proud.",
    "What's something you accomplished that seemed impossible?",
    "Describe a time when your hard work paid off.",
    "What's a compliment you received that you'll never forget?",
    "Tell me about a goal you achieved against the odds.",
    "What's something you created that you're proud of?",
    "Describe a moment when you exceeded your own expectations.",
    "What's a skill you mastered through persistence?",
    "Tell me about a time you helped someone else succeed.",
    "What's an award or recognition that meant something to you?",
    "Describe a moment when you proved someone wrong (in a good way).",
    "What's something you built or made with your own hands?",
    "Tell me about a time you were a leader.",
    "What's a personal record or milestone you reached?",
    "Describe a moment when you realized you'd made a difference.",
  ],
  loss: [
    "Tell me about saying goodbye to someone important.",
    "What's something you lost that you still miss?",
    "Describe a place that's no longer there.",
    "What's a tradition that ended?",
    "Tell me about a pet you loved and lost.",
    "What's something you wish you'd said but never did?",
    "Describe a friendship that faded away.",
    "What's a dream you had to let go of?",
    "Tell me about the last time you saw someone important.",
    "What's something from your past you can never get back?",
    "Describe a moment when you realized something was over.",
    "What's a way you honor someone who's no longer here?",
    "Tell me about a time when 'normal' changed forever.",
    "What's something you took for granted until it was gone?",
    "Describe a moment when you had to say goodbye to who you used to be.",
  ],
  joy: [
    "Tell me about a moment of pure happiness.",
    "What's something that always makes you smile?",
    "Describe a celebration that was perfect.",
    "What's a surprise that delighted you?",
    "Tell me about a time you laughed until you cried.",
    "What's a simple pleasure that brings you joy?",
    "Describe a moment when you felt completely free.",
    "What's something beautiful you witnessed?",
    "Tell me about a time when everything felt right with the world.",
    "What's a gift you gave that made someone happy?",
    "Describe a moment of unexpected kindness.",
    "What's a tradition or ritual that brings you joy?",
    "Tell me about a time you felt grateful beyond words.",
    "What's a sound that makes you happy?",
    "Describe a moment when you felt truly alive.",
  ],
  lessons: [
    "What's something you learned too late?",
    "Tell me about a teacher who changed your life.",
    "What's a lesson you learned from a child?",
    "Describe a moment when you understood something important.",
    "What's something you wish you'd known earlier?",
    "Tell me about a time when you were wrong about someone.",
    "What's a piece of wisdom someone shared with you?",
    "Describe a moment when you learned something about yourself.",
    "What's something you learned from failure?",
    "Tell me about a book, movie, or story that taught you something.",
    "What's a lesson you learned from watching others?",
    "Describe a moment when you changed your mind about something important.",
    "What's something you learned about life from an unexpected source?",
    "Tell me about a time when you learned the value of patience.",
    "What's a truth you discovered that others might not understand?",
  ],
}

const categoryOptions = [
  { value: "childhood", label: "Childhood" },
  { value: "family", label: "Family" },
  { value: "love", label: "Love & Relationships" },
  { value: "growth", label: "Personal Growth" },
  { value: "challenges", label: "Challenges & Hardships" },
  { value: "achievements", label: "Achievements & Successes" },
  { value: "loss", label: "Loss & Grief" },
  { value: "joy", label: "Joy & Happiness" },
  { value: "lessons", label: "Life Lessons" },
]

const emotionOptions = [
  { value: "joy", label: "Joy", emoji: "😊" },
  { value: "pride", label: "Pride", emoji: "🏆" },
  { value: "love", label: "Love", emoji: "❤️" },
  { value: "excitement", label: "Excitement", emoji: "🎉" },
  { value: "contentment", label: "Contentment", emoji: "😌" },
  { value: "gratitude", label: "Gratitude", emoji: "🙏" },
  { value: "relief", label: "Relief", emoji: "😮‍💨" },
  { value: "hope", label: "Hope", emoji: "🌟" },
  { value: "sadness", label: "Sadness", emoji: "😢" },
  { value: "grief", label: "Grief", emoji: "💔" },
  { value: "regret", label: "Regret", emoji: "😔" },
  { value: "fear", label: "Fear", emoji: "😰" },
  { value: "anger", label: "Anger", emoji: "😠" },
  { value: "frustration", label: "Frustration", emoji: "😤" },
  { value: "anxiety", label: "Anxiety", emoji: "😟" },
  { value: "loneliness", label: "Loneliness", emoji: "😞" },
  { value: "confusion", label: "Confusion", emoji: "😕" },
  { value: "determination", label: "Determination", emoji: "💪" },
  { value: "curiosity", label: "Curiosity", emoji: "🤔" },
  { value: "peace", label: "Peace", emoji: "☮️" },
]

const toneOptions = [
  { id: "warm", label: "Warm", description: "Gentle and comforting" },
  { id: "honest", label: "Honest", description: "Direct and authentic" },
  { id: "poetic", label: "Poetic", description: "Lyrical and beautiful" },
  { id: "humorous", label: "Humorous", description: "Light and playful" },
  { id: "raw", label: "Raw", description: "Unfiltered and real" },
]

export default function MemoryPrompt({ userIntent, onMemoryAdded, onViewHub, memoriesCount }: MemoryPromptProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [showCategorySelection, setShowCategorySelection] = useState(true)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [followUps, setFollowUps] = useState<string[]>([])
  const [followUpResponses, setFollowUpResponses] = useState<string[]>([])
  const [showToneSelection, setShowToneSelection] = useState(false)
  const [selectedTone, setSelectedTone] = useState<string | null>(null)
  const [aiDraft, setAiDraft] = useState<string | null>(null)
  const [reflection, setReflection] = useState("")
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [apiKeyMissing, setApiKeyMissing] = useState(false)

  const generateFollowUps = () => {
    const followUpQuestions = [
      "Who was with you during this memory?",
      "What happened next?",
      "How did this make you feel?",
      "What details do you remember most clearly?",
      "Why do you think this memory stayed with you?",
    ]

    const randomFollowUps = followUpQuestions.sort(() => 0.5 - Math.random()).slice(0, 2)

    setFollowUps(randomFollowUps)
  }

  const handleResponseSubmit = () => {
    if (response.trim()) {
      generateFollowUps()
    }
  }

  const handleFollowUpResponse = (index: number, value: string) => {
    const newResponses = [...followUpResponses]
    newResponses[index] = value
    setFollowUpResponses(newResponses)
  }

  const handleContinueToTone = () => {
    setShowToneSelection(true)
  }

  const handleToneSelect = async (tone: string) => {
    setSelectedTone(tone)
    setIsGenerating(true)
    setApiKeyMissing(false)

    try {
      const fullResponse = [response, ...followUpResponses.filter((r) => r.trim())].join(" ")
      const draft = await generateMemoryDraft(currentPrompt, fullResponse, tone)
      setAiDraft(draft)
    } catch (error) {
      console.error("Error generating draft:", error)
      if (error instanceof Error && error.message && error.message.includes("API key")) {
        setApiKeyMissing(true)
      }
      // Still set a fallback draft so user can continue
      setAiDraft(`This memory holds a special place in my heart. ${[response, ...followUpResponses.filter((r) => r.trim())].join(" ")} 

Looking back on this experience, I can see how it shaped who I am today. Every memory is a thread in the tapestry of our lives, and this one is woven deeply into mine.`)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveMemory = () => {
    const memory: Memory = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      response: [response, ...followUpResponses.filter((r) => r.trim())].join(" "),
      aiDraft: aiDraft || undefined,
      reflection: reflection || undefined,
      tone: selectedTone || undefined,
      tags: [],
      emotions: selectedEmotions,
      timestamp: new Date(),
    }

    onMemoryAdded(memory)

    // Reset for next memory
    setResponse("")
    setFollowUps([])
    setFollowUpResponses([])
    setShowToneSelection(false)
    setSelectedTone(null)
    setAiDraft(null)
    setReflection("")
    setSelectedEmotions([])
    setShowCategorySelection(true)
    setSelectedCategory(null)
    setCurrentPrompt("")
  }

  const getNewPrompt = (category?: string) => {
    const cat = category || selectedCategory
    if (cat && memoryPromptsByCategory[cat as keyof typeof memoryPromptsByCategory]) {
      const categoryPrompts = memoryPromptsByCategory[cat as keyof typeof memoryPromptsByCategory]
      setCurrentPrompt(categoryPrompts[Math.floor(Math.random() * categoryPrompts.length)])
    } else {
      // Fallback to random from all categories
      const allPrompts = Object.values(memoryPromptsByCategory).flat()
      setCurrentPrompt(allPrompts[Math.floor(Math.random() * allPrompts.length)])
    }
  }

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
    setShowCategorySelection(false)
    getNewPrompt(category)
  }

  const handleCustomPromptSubmit = () => {
    if (customPrompt.trim()) {
      setCurrentPrompt(customPrompt.trim())
      setShowCustomPrompt(false)
      setShowCategorySelection(false)
      setCustomPrompt("")
    }
  }

  const startOver = () => {
    setShowCategorySelection(true)
    setSelectedCategory(null)
    setCurrentPrompt("")
    setResponse("")
    setFollowUps([])
    setFollowUpResponses([])
    setShowToneSelection(false)
    setSelectedTone(null)
    setAiDraft(null)
    setReflection("")
  }

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-black">Memory Excavation</h1>
            {memoriesCount > 0 && (
              <p className="text-black font-body">{memoriesCount} memories woven into your tapestry</p>
            )}
          </div>
          {memoriesCount > 0 && (
            <Button
              variant="outline"
              onClick={onViewHub}
              className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
            >
              View Memory Hub
            </Button>
          )}
        </div>

        {showCategorySelection ? (
          <div className="space-y-6">
            <Card className="border-warm-taupe bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-heading text-black">Choose a theme for your memory:</CardTitle>
                <p className="text-black font-body">What aspect of your life would you like to explore?</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(memoryPromptsByCategory).map(([category, prompts]) => {
                    const categoryOption = categoryOptions.find((opt) => opt.value === category)
                    return (
                      <Button
                        key={category}
                        variant="outline"
                        onClick={() => handleCategorySelect(category)}
                        className="justify-start h-auto p-4 bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                      >
                        <div className="text-left">
                          <div className="font-medium font-body text-white">{categoryOption?.label || category}</div>
                          {/* <div className="text-sm opacity-90 font-body text-white">{prompts.length} prompts</div> */}
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-warm-taupe bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-heading text-black">Or create your own prompt:</CardTitle>
                <p className="text-black font-body">Have something specific you want to remember?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showCustomPrompt ? (
                  <Button
                    onClick={() => setShowCustomPrompt(true)}
                    variant="outline"
                    className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                  >
                    Write a Custom Prompt
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="What would you like to remember? (e.g., 'Tell me about the house you grew up in' or 'What's a conversation that changed everything?')"
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCustomPromptSubmit}
                        disabled={!customPrompt.trim()}
                        className="bg-terracotta hover:bg-terracotta-dark text-white"
                      >
                        Use this prompt
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowCustomPrompt(false)
                          setCustomPrompt("")
                        }}
                        className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {selectedCategory && (
                    <Badge className="mb-2 bg-terracotta/10 text-terracotta border-terracotta/30">
                      {categoryOptions.find((opt) => opt.value === selectedCategory)?.label || selectedCategory}
                    </Badge>
                  )}
                  <CardTitle className="text-xl font-heading text-black leading-relaxed">{currentPrompt}</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => getNewPrompt()}
                    className="text-black hover:text-white hover:bg-terracotta"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={startOver}
                    className="text-black hover:text-white hover:bg-terracotta"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Take your time... what comes to mind?"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="min-h-24 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
              />

              {!followUps.length && response.trim() && (
                <Button onClick={handleResponseSubmit} className="bg-terracotta hover:bg-terracotta-dark text-white">
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {followUps.length > 0 && (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-black">Let's explore this memory deeper</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {followUps.map((followUp, index) => (
                <div key={index} className="space-y-2">
                  <p className="text-black font-body">{followUp}</p>
                  <Textarea
                    placeholder="If you're stuck, try this... or skip if it doesn't resonate"
                    value={followUpResponses[index] || ""}
                    onChange={(e) => handleFollowUpResponse(index, e.target.value)}
                    className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
              ))}

              <Button onClick={handleContinueToTone} className="mt-4 bg-terracotta hover:bg-terracotta-dark text-white">
                Turn into a story
                <Sparkles className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {showToneSelection && !selectedTone && (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-black">Choose your voice</CardTitle>
              <p className="text-black font-body">How would you like this memory to be written?</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {toneOptions.map((tone) => (
                  <Button
                    key={tone.id}
                    variant="outline"
                    onClick={() => handleToneSelect(tone.id)}
                    className="justify-start h-auto p-4 bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                  >
                    <div className="text-left">
                      <div className="font-medium font-body text-white">{tone.label}</div>
                      <div className="text-sm font-body text-white">{tone.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {isGenerating && (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 animate-spin mx-auto mb-4 text-terracotta-dark" />
              <p className="text-black font-body">Crafting your memory into a story...</p>
            </CardContent>
          </Card>
        )}

        {apiKeyMissing && (
          <Card className="mb-6 border-orange-200 bg-orange-50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900 mb-1">AI Features Unavailable</h4>
                  <p className="text-sm text-orange-800 mb-2">
                    To use AI-powered memory drafts, you'll need to add your OpenAI API key to the .env.local file.
                  </p>
                  <p className="text-xs text-orange-700">
                    Don't worry - you can still save your memory and add AI drafts later!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {aiDraft && (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-black">Your Memory Story</CardTitle>
              <Badge variant="secondary" className="bg-sage/20 text-black border-sage/30">
                {selectedTone} tone
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-warm-paper p-4 rounded-lg border border-warm-taupe">
                <p className="whitespace-pre-wrap text-black font-body leading-relaxed">{aiDraft}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black font-body">Add a reflection (optional)</label>
                <p className="text-xs text-black font-body">What did you learn from this time in your life?</p>
                <Textarea
                  placeholder="What I wish I'd known then..."
                  value={reflection}
                  onChange={(e) => setReflection(e.target.value)}
                  className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-black font-body">How did this make you feel? (optional)</label>
                <div className="flex flex-wrap gap-1">
                  {emotionOptions.map((emotion) => (
                    <button
                      key={emotion.value}
                      type="button"
                      onClick={() => {
                        setSelectedEmotions(prev => 
                          prev.includes(emotion.value)
                            ? prev.filter(e => e !== emotion.value)
                            : [...prev, emotion.value]
                        )
                      }}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body transition-all ${
                        selectedEmotions.includes(emotion.value)
                          ? 'bg-terracotta-pale text-black border-2 border-terracotta shadow-sm'
                          : 'bg-stone-100 hover:bg-stone-200 text-black border-2 border-transparent'
                      }`}
                    >
                      <span className="text-sm">{emotion.emoji}</span>
                      <span>{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button onClick={handleSaveMemory} className="w-full bg-terracotta hover:bg-terracotta-dark text-white">
                Save this memory
              </Button>
            </CardContent>
          </Card>
        )}

        {memoriesCount > 0 && (
          <div className="text-center py-8">
            <p className="text-black mb-4 font-body">Each memory is just one thread in the story of your life.</p>
            <TapestryLogo size={32} className="mx-auto opacity-60" />
          </div>
        )}
      </div>
    </div>
  )
}
