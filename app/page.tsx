"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Users, Sparkles } from "lucide-react"
import TapestryLogo from "@/components/tapestry-logo"
import IntentSetting from "@/components/intent-setting"
import MemoryPrompt from "@/components/memory-prompt"
import MemoryHub from "@/components/memory-hub"
import ChapterBuilder from "@/components/chapter-builder"
import BookView from "@/components/book-view"
import { useLocalStorageData } from "@/hooks/use-local-storage-data"

export type UserIntent = "make-sense" | "leave-legacy" | "explore-memories"

export type Memory = {
  id: string
  prompt: string
  response: string
  aiDraft?: string
  reflection?: string
  tone?: string
  tags: string[]
  emotions: string[]
  timestamp: Date
  category?: string
}

export type Chapter = {
  id: string
  title: string
  description?: string
  memoryIds: string[]
  introduction?: string
  transitions: { [key: string]: string }
  order: number
}

export default function MemoirBuilder() {
  const { memories, chapters, isLoading, addMemory, updateMemories, updateChapters } = useLocalStorageData()

  const [currentStep, setCurrentStep] = useState<"welcome" | "intent" | "prompt" | "hub" | "chapters" | "book">(
    "welcome",
  )
  const [userIntent, setUserIntent] = useState<UserIntent | null>(null)

  // Show loading while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-terracotta/10 rounded-full mx-auto mb-6 w-fit border border-terracotta/20">
            <TapestryLogo size={40} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-heading text-black mb-2">Tapestry</h2>
          <p className="text-black font-body">Loading your memories...</p>
        </div>
      </div>
    )
  }

  const handleIntentSet = (intent: UserIntent) => {
    setUserIntent(intent)
    setCurrentStep("prompt")
  }

  const handleMemoryAdded = async (memory: Omit<Memory, "id">) => {
    try {
      await addMemory(memory)
    } catch (error) {
      console.error("Error adding memory:", error)
    }
  }

  const handleViewHub = () => {
    setCurrentStep("hub")
  }

  const handleAddAnother = () => {
    setCurrentStep("prompt")
  }

  const handleViewChapters = () => {
    setCurrentStep("chapters")
  }

  const handleViewBook = () => {
    setCurrentStep("book")
  }

  if (currentStep === "welcome") {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <div className="space-y-6">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-transparent border-transparent px-[9px] py-2.5 border-0 border-none">
                <TapestryLogo size={60} />
              </div>
            </div>
            <div className="space-y-3">
              <h1 className="text-5xl font-heading font-semibold text-black tracking-tight">Welcome to Tapestry</h1>
              <div className="w-24 h-0.5 bg-terracotta mx-auto"></div>
              <p className="text-xl font-heading italic text-black">Your life. Woven together.</p>
            </div>
            <h2 className="text-2xl font-body text-black">
              {memories.length > 0 ? "Ready to continue your story?" : "Let's begin remembering your story."}
            </h2>
            <p className="text-lg text-black max-w-xl mx-auto leading-relaxed">
              {memories.length > 0
                ? `You have ${memories.length} ${memories.length === 1 ? "memory" : "memories"} and ${
                    chapters.length
                  } ${chapters.length === 1 ? "chapter" : "chapters"} woven into your tapestry.`
                : "This isn't about writing a perfect book. It's about remembering what shaped you, one thread at a time."}
            </p>
          </div>

          <div className="grid gap-4 max-w-md mx-auto">
            {memories.length > 0 ? (
              <div className="space-y-3">
                <Button
                  onClick={handleViewHub}
                  size="lg"
                  className="h-14 text-lg bg-terracotta hover:bg-terracotta-dark text-white font-medium w-full shadow-lg"
                >
                  <TapestryLogo size={20} className="mr-2" />
                  View Memory Hub
                </Button>
                <Button
                  onClick={() => setCurrentStep("intent")}
                  variant="outline"
                  size="lg"
                  className="h-14 text-lg w-full bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Add New Memory
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setCurrentStep("intent")}
                size="lg"
                className="h-14 text-lg bg-terracotta hover:bg-terracotta-dark text-white font-medium shadow-lg"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start weaving your story
              </Button>
            )}

            <div className="flex items-center justify-center gap-6 text-sm text-black mt-6">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-terracotta" />
                <span>Emotionally safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-terracotta" />
                <span>Your pace</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-black mt-8">
            <p>Your memories are stored locally in your browser and remain completely private.</p>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "intent") {
    return <IntentSetting onIntentSet={handleIntentSet} onBack={() => setCurrentStep("welcome")} />
  }

  if (currentStep === "prompt") {
    return (
      <MemoryPrompt
        userIntent={userIntent!}
        onMemoryAdded={handleMemoryAdded}
        onViewHub={handleViewHub}
        memoriesCount={memories.length}
      />
    )
  }

  if (currentStep === "hub") {
    return (
      <MemoryHub
        memories={memories}
        onAddAnother={handleAddAnother}
        setMemories={updateMemories}
        onViewChapters={handleViewChapters}
        hasChapters={chapters.length > 0}
      />
    )
  }

  if (currentStep === "chapters") {
    return (
      <ChapterBuilder
        memories={memories}
        chapters={chapters}
        setChapters={updateChapters}
        onBack={handleViewHub}
        onViewBook={handleViewBook}
      />
    )
  }

  if (currentStep === "book") {
    return (
      <BookView
        memories={memories}
        chapters={chapters}
        onBack={() => setCurrentStep("chapters")}
        userIntent={userIntent!}
      />
    )
  }

  return null
}
