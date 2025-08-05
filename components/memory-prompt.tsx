"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, RefreshCw, ArrowLeft, Heart, Edit3 } from "lucide-react"
import type { Memory } from "@/app/page"



interface MemoryPromptProps {
  onMemoryAdded: (memory: Memory) => void
  onViewHub: () => void
  memoriesCount: number
  existingMemories: Memory[]
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
    "What's a place from your childhood that no longer exists?",
    "Tell me about a birthday you remember vividly.",
    "What was your favorite outfit or costume as a kid?",
    "Describe a time you felt really brave as a child.",
    "What did you want to be when you grew up—and why?",
  ],
  family: [
    "What was your relationship like with your siblings growing up?",
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
    "Tell me about a moment when you felt especially proud of a family member.",
    "Describe a family tradition that has changed—or stayed the same—over time.",
    "What's a story you've heard about your grandparents or great-grandparents?",
    "How did your family handle conflict or disagreements?",
    "What's a smell, sound, or object that instantly reminds you of home?",
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
    "What's a place that holds memories of love for you?",
    "Tell me about a time you made a grand gesture for someone.",
    "What's a small, everyday moment that felt full of love?",
    "Describe the feeling of falling out of love.",
    "What's something you once believed about love that changed over time?",
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
    "What's a book, movie, or experience that shifted how you see the world?",
    "Tell me about a time you stepped out of your comfort zone.",
    "What's something you used to avoid but now embrace?",
    "Describe a time you let go of something—or someone—you'd outgrown.",
    "What's a belief or value you grew into over time?",
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
    "Tell me about a time you had to ask for help.",
    "What's something you never thought you'd get through—but did?",
    "Describe a setback that changed your direction.",
    "What's a time when you felt torn between two paths?",
    "Tell me about a moment when you questioned everything.",
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
    "What's a lesson you learned from a failure?",
    "Tell me about a time you stepped up for someone.",
    "What's a moment when you felt like you were on top of the world?",
    "Describe a time when you overcame a personal obstacle.",
    "What's a belief or value you hold dear?",
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
    "What's a way you've honored someone who's no longer here?",
    "Tell me about a time when you felt like you were losing someone.",
    "What's a memory that's hard to forget?",
    "Describe a moment when you felt like you were losing yourself.",
    "What's a way you've grieved for someone who's no longer here?",
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
    "What's a way you've found joy in the midst of difficulty?",
    "Tell me about a time when you felt like you were on top of the world.",
    "What's a memory that brings you joy every time you think about it?",
    "Describe a moment when you felt like you were truly in the moment.",
    "What's a way you've found joy in the midst of difficulty?",
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
    "Tell me about a time when you learned the value of patience.",
    "What's a lesson you learned from watching others?",
    "Describe a moment when you changed your mind about something important.",
    "What's something you learned about life from an unexpected source?",
    "Tell me about a time when you learned the value of patience.",
    "What's a truth you discovered that others might not understand?",
    "Tell me about a time when you learned the value of patience.",
  ],
  hope: [
    "Tell me about a time when you felt like you had nothing left.",
    "What's a moment when you felt like you were on top of the world.",
    "Describe a time when you felt like you were truly in the moment.",
    "What's a way you've found joy in the midst of difficulty?",
    "Tell me about a time when you learned the value of patience.",
    "What's a truth you discovered that others might not understand?",
    "Tell me about a time when you learned the value of patience.",
    "What's a lesson you learned from watching others?",
    "Describe a moment when you changed your mind about something important.",
    "What's something you learned about life from an unexpected source?",
    "Tell me about a time when you learned the value of patience.",
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
  { value: "hope", label: "Hope" },
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



export default function MemoryPrompt({ onMemoryAdded, onViewHub, memoriesCount, existingMemories }: MemoryPromptProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCustomPrompt, setShowCustomPrompt] = useState(false)
  const [customPrompt, setCustomPrompt] = useState("")
  const [showCategorySelection, setShowCategorySelection] = useState(true)
  const [currentPrompt, setCurrentPrompt] = useState("")
  const [response, setResponse] = useState("")
  const [followUps, setFollowUps] = useState<string[]>([])
  const [followUpResponses, setFollowUpResponses] = useState<string[]>([])

  const [showDetailsSection, setShowDetailsSection] = useState(false)
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([])
  const [selectedPeople, setSelectedPeople] = useState<string[]>([])
  const [newPersonName, setNewPersonName] = useState<string>("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [newTagName, setNewTagName] = useState<string>("")
  const [memoryDate, setMemoryDate] = useState<string>("")
  const [memorySaved, setMemorySaved] = useState(false)
  const [savedMemoryTitle, setSavedMemoryTitle] = useState("")

  // Extract previously used people and tags from existing memories
  const previouslyUsedPeople = Array.from(new Set(
    existingMemories.flatMap(memory => memory.people || [])
  )).sort()

  const previouslyUsedTags = Array.from(new Set(
    existingMemories.flatMap(memory => memory.tags || [])
  )).sort()

  const generateFollowUps = () => {
    // Generate contextual follow-ups based on the prompt and response
    const contextualQuestions = []
    
    // Add questions based on the type of memory/prompt
    if (currentPrompt.toLowerCase().includes('first time') || currentPrompt.toLowerCase().includes('first')) {
      contextualQuestions.push("What expectations did you have beforehand?")
      contextualQuestions.push("How did the reality compare to what you imagined?")
    }
    
    if (currentPrompt.toLowerCase().includes('challenging') || currentPrompt.toLowerCase().includes('difficult')) {
      contextualQuestions.push("What helped you get through this?")
      contextualQuestions.push("What would you tell someone facing a similar challenge?")
    }
    
    if (currentPrompt.toLowerCase().includes('person') || currentPrompt.toLowerCase().includes('someone')) {
      contextualQuestions.push("What did this person teach you?")
      contextualQuestions.push("How did they influence your life?")
    }
    
    if (currentPrompt.toLowerCase().includes('childhood') || currentPrompt.toLowerCase().includes('young')) {
      contextualQuestions.push("How do you see this differently as an adult?")
      contextualQuestions.push("What would you tell your younger self?")
    }
    
    // Universal follow-ups that work for most memories
    const universalQuestions = [
      "What details do you remember most clearly?",
      "Who else was involved in this memory?",
      "What happened next?",
      "Why do you think this memory stayed with you?",
      "How did this experience change you?",
      "What emotions do you feel when thinking about this?",
      "What would you want others to learn from this story?",
    ]
    
    // Combine contextual and universal, remove duplicates, shuffle, and take 2
    const allQuestions = [...new Set([...contextualQuestions, ...universalQuestions])]
    const selectedFollowUps = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 2)
    
    setFollowUps(selectedFollowUps)
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

  const handleContinueToDetails = () => {
    setShowDetailsSection(true)
  }

  const handleSaveMemory = () => {
    const filteredFollowUpResponses = followUpResponses.filter((r) => r.trim())
    const additionalThoughts = followUpResponses[followUps.length] 
      ? followUpResponses[followUps.length].trim() 
      : undefined

    // Store follow-up questions that have responses
    const questionsWithResponses = followUps.filter((_, index) => followUpResponses[index]?.trim())

    const memory: Memory = {
      id: Date.now().toString(),
      prompt: currentPrompt,
      response: response,
      followUpQuestions: questionsWithResponses.length > 0 ? questionsWithResponses : undefined,
      followUpResponses: filteredFollowUpResponses.slice(0, followUps.length), // Only the structured follow-ups
      additionalThoughts: additionalThoughts || undefined,
      tags: selectedTags,
      emotions: selectedEmotions,
      people: selectedPeople,
      timestamp: new Date(),
      memoryDate: memoryDate ? new Date(memoryDate) : undefined,
      category: selectedCategory || undefined,
    }

    onMemoryAdded(memory)

    // Show success state instead of immediately resetting
    setSavedMemoryTitle(currentPrompt.length > 60 ? currentPrompt.substring(0, 60) + "..." : currentPrompt)
    setMemorySaved(true)
  }

  const startNewMemory = () => {
    // Reset all state for a new memory
    setResponse("")
    setFollowUps([])
    setFollowUpResponses([])
    setShowDetailsSection(false)
    setSelectedEmotions([])
    setSelectedPeople([])
    setNewPersonName("")
    setSelectedTags([])
    setNewTagName("")
    setMemoryDate("")
    setShowCategorySelection(true)
    setSelectedCategory(null)
    setCurrentPrompt("")
    setMemorySaved(false)
    setSavedMemoryTitle("")
    setShowCustomPrompt(false)
    setCustomPrompt("")
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
  }

  return (
    <div className="bg-warm-cream p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-heading font-semibold text-black">Memory Excavation</h1>
            {memoriesCount > 0 && (
              <p className="text-black font-body">You currently have {memoriesCount} memories in your Keepsake.</p>
            )}
          </div>
          </div>

        {memorySaved ? (
          <Card className="mb-6 border-warm-taupe bg-warm-paper shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-black flex items-center">
                ✅ Memory Successfully Saved!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-terracotta/10 p-3 rounded-lg border border-terracotta/20">
                <p className="text-black font-body font-medium">"{savedMemoryTitle}"</p>
              </div>
              <p className="text-black font-body">
                Your memory has been added to your Keepsake. What would you like to do next?
              </p>
              <div className="flex gap-3 pt-2">
                <Button
                  onClick={onViewHub}
                  className="bg-terracotta hover:bg-terracotta-dark text-white"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  View Keepsake
                </Button>
                <Button
                  onClick={startNewMemory}
                  variant="outline"
                  className="bg-warm-paper hover:bg-terracotta-pale text-black border-warm-taupe"
                >
                  ➕ Create Another Memory
                </Button>
                <Button
                  onClick={() => {
                    setMemorySaved(false)
                    setShowDetailsSection(true)
                  }}
                  variant="ghost"
                  className="text-black hover:bg-terracotta-pale hover:text-black"
                >
                  <Edit3 className="mr-2 h-4 w-4" />
                  Edit Memory
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {showCategorySelection && (
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
                <CardTitle className="text-xl font-heading text-black">Or create your own prompt:</CardTitle>
                <p className="text-black font-body">Have something specific you want to remember?</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showCustomPrompt ? (
                  <Button
                    onClick={() => setShowCustomPrompt(true)}
                    variant="outline"
                    className="bg-terracotta hover:bg-terracotta-dark hover:text-white text-white border-terracotta"
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
                        className="bg-terracotta/10 hover:bg-terracotta/50 text-black border-terracotta"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {!showCategorySelection && !memorySaved && (
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
                    placeholder="Add in your thoughts, or skip this if it doesn't resonate..."
                    value={followUpResponses[index] || ""}
                    onChange={(e) => handleFollowUpResponse(index, e.target.value)}
                    className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
              ))}

              {/* Additional thoughts section */}
              <div className="border-t border-warm-taupe pt-4 mt-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium text-black font-body">
                    Any other details, feelings, or thoughts you'd like to capture?
                  </label>
                  <Textarea
                    placeholder="Share anything else about this memory... sounds, smells, conversations, how it changed you, what you learned, whatever feels right."
                    value={followUpResponses[followUps.length] || ""}
                    onChange={(e) => handleFollowUpResponse(followUps.length, e.target.value)}
                    className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
              </div>

              <Button onClick={handleContinueToDetails} className="mt-4 bg-terracotta hover:bg-terracotta-dark text-white">
                Add Details & Save
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {showDetailsSection && !memorySaved && (
          <Card className="mb-6 border-warm-taupe bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-heading text-black">Add Details</CardTitle>
              <p className="text-black font-body">Help organize and enrich this memory</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-black font-body">When did this happen? (optional)</label>
                <p className="text-xs text-black font-body">Help organize your memories chronologically</p>
                <Input
                  type="date"
                  value={memoryDate}
                  onChange={(e) => setMemoryDate(e.target.value)}
                  className="bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
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
                          ? 'bg-stone-100 text-black border-2 border-terracotta opacity-100'
                          : 'bg-stone-100 hover:bg-stone-200 text-black border-2 border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      <span className="text-sm">{emotion.emoji}</span>
                      <span>{emotion.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black font-body">Who was involved in this memory? (optional)</label>
                <div className="space-y-2">
                  {selectedPeople.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedPeople.map((person, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="gap-1 border-warm-taupe text-black hover:bg-terracotta-pale"
                        >
                          👤 {person}
                          <button 
                            onClick={() => {
                              setSelectedPeople(prev => prev.filter(p => p !== person))
                            }}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Previously used people */}
                  {previouslyUsedPeople.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-black font-body">Previously added people:</p>
                      <div className="flex flex-wrap gap-1">
                        {previouslyUsedPeople.map((person) => (
                          <button
                            key={person}
                            type="button"
                            onClick={() => {
                              if (!selectedPeople.includes(person)) {
                                setSelectedPeople(prev => [...prev, person])
                              }
                            }}
                            disabled={selectedPeople.includes(person)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body transition-all ${
                              selectedPeople.includes(person)
                                ? 'bg-stone-100 text-black border-2 border-terracotta opacity-100'
                                : 'bg-stone-100 hover:bg-stone-200 text-black border-2 border-transparent opacity-60 hover:opacity-80'
                            }`}
                          >
                            <span>👤</span>
                            <span>{person}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a person..."
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const name = newPersonName.trim()
                          if (name && !selectedPeople.includes(name)) {
                            setSelectedPeople(prev => [...prev, name])
                            setNewPersonName("")
                          }
                        }
                      }}
                      className="flex-1 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const name = newPersonName.trim()
                        if (name && !selectedPeople.includes(name)) {
                          setSelectedPeople(prev => [...prev, name])
                          setNewPersonName("")
                        }
                      }}
                      disabled={!newPersonName.trim()}
                      className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-black font-body">Add tags to organize this memory (optional)</label>
                <div className="space-y-2">
                  {selectedTags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {selectedTags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="gap-1 border-warm-taupe text-black hover:bg-terracotta-pale"
                        >
                          🏷️ {tag}
                          <button 
                            onClick={() => {
                              setSelectedTags(prev => prev.filter(t => t !== tag))
                            }}
                            className="ml-1 hover:text-red-500"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {/* Previously used tags */}
                  {previouslyUsedTags.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs text-black font-body">Previously used tags:</p>
                      <div className="flex flex-wrap gap-1">
                        {previouslyUsedTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (!selectedTags.includes(tag)) {
                                setSelectedTags(prev => [...prev, tag])
                              }
                            }}
                            disabled={selectedTags.includes(tag)}
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body transition-all ${
                              selectedTags.includes(tag)
                                ? 'bg-stone-100 text-black border-2 border-terracotta opacity-100'
                                : 'bg-stone-100 hover:bg-stone-200 text-black border-2 border-transparent opacity-60 hover:opacity-80'
                            }`}
                          >
                            <span>🏷️</span>
                            <span>{tag}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a tag..."
                      value={newTagName}
                      onChange={(e) => setNewTagName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          const tag = newTagName.trim()
                          if (tag && !selectedTags.includes(tag)) {
                            setSelectedTags(prev => [...prev, tag])
                            setNewTagName("")
                          }
                        }
                      }}
                      className="flex-1 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        const tag = newTagName.trim()
                        if (tag && !selectedTags.includes(tag)) {
                          setSelectedTags(prev => [...prev, tag])
                          setNewTagName("")
                        }
                      }}
                      disabled={!newTagName.trim()}
                      className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveMemory} className="w-full bg-terracotta hover:bg-terracotta-dark text-white">
                Save this memory
              </Button>
            </CardContent>
          </Card>
        )}


          </>
        )}
      </div>
    </div>
  )
}
