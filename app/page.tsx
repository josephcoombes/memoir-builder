"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Users, Sparkles } from "lucide-react"
import TapestryLogo from "@/components/tapestry-logo"

import MemoryPrompt from "@/components/memory-prompt"
import MemoryHub from "@/components/memory-hub"
import Navigation from "@/components/navigation"

import { useLocalStorageData } from "@/hooks/use-local-storage-data"


export type Memory = {
  id: string
  prompt: string
  response: string
  followUpQuestions?: string[]
  followUpResponses?: string[]
  additionalThoughts?: string
  tags: string[]
  emotions: string[]
  people: string[]
  timestamp: Date
  memoryDate?: Date
  category?: string
}

export default function MemoirBuilder() {
  const { memories, isLoading, addMemory, updateMemories } = useLocalStorageData()

  const [currentStep, setCurrentStep] = useState<"welcome" | "prompt" | "hub">("welcome")

  // Show loading while data is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-warm-cream flex items-center justify-center">
        <div className="text-center">
          <div className="p-4 bg-terracotta/10 rounded-full mx-auto mb-6 w-fit border border-terracotta/20">
            <TapestryLogo size={40} className="animate-pulse" />
          </div>
          <h2 className="text-xl font-heading text-black mb-2">Keepsake</h2>
          <p className="text-black font-body">Loading your memories...</p>
        </div>
      </div>
    )
  }

  const handleStartPrompt = () => {
    setCurrentStep("prompt")
  }

  const handleNavigate = (step: "welcome" | "prompt" | "hub") => {
    setCurrentStep(step)
  }

  const handleMemoryAdded = async (memory: Omit<Memory, "id">) => {
    await addMemory(memory)
  }

  const handleViewHub = () => {
    setCurrentStep("hub")
  }

  const handleAddAnother = () => {
    setCurrentStep("prompt")
  }

  return (
    <div className="min-h-screen bg-warm-cream">
      <Navigation 
        currentStep={currentStep} 
        onNavigate={handleNavigate} 
        memoriesCount={memories.length}
      />
      
      {currentStep === "welcome" && (
        <div className="flex items-center justify-center p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-transparent border-transparent px-[9px] py-2.5 border-0 border-none">
                  <TapestryLogo size={60} />
                </div>
              </div>
              <div className="space-y-3">
                <h1 className="text-5xl font-heading font-semibold text-black tracking-tight">Welcome to Keepsake</h1>
                <div className="w-24 h-0.5 bg-terracotta mx-auto"></div>
                <p className="text-xl font-heading italic text-black">Your personal memory archive.</p>
              </div>
              <h2 className="text-2xl font-body text-black">
                {memories.length > 0 ? "Ready to continue your story?" : "Let's begin remembering your story."}
              </h2>
              <p className="text-lg text-black max-w-xl mx-auto leading-relaxed">
                {memories.length > 0
                  ? `You currently have ${memories.length} ${memories.length === 1 ? "memory" : "memories"} in your Keepsake.`
                  : "This isn't about keeping a perfect record. It's about remembering what shaped you, one memory at a time."}
              </p>
            </div>

            <div className="grid gap-4 max-w-md mx-auto">
              {memories.length > 0 ? (
                <div className="space-y-3">
                  <Button
                    onClick={handleStartPrompt}
                    size="lg"
                    className="h-14 text-lg bg-terracotta hover:bg-terracotta-dark text-white font-medium w-full shadow-lg"
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Add New Memory
                  </Button>
                  <Button
                    onClick={handleViewHub}
                    variant="outline"
                    size="lg"
                    className="h-14 text-lg w-full bg-warm-paper hover:bg-terracotta-pale text-black border-warm-taupe"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    View Keepsake
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleStartPrompt}
                  size="lg"
                  className="h-14 text-lg bg-terracotta hover:bg-terracotta-dark text-white font-medium shadow-lg"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start your keepsake
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {currentStep === "prompt" && (
        <MemoryPrompt
          onMemoryAdded={handleMemoryAdded}
          onViewHub={handleViewHub}
          memoriesCount={memories.length}
          existingMemories={memories}
        />
      )}

      {currentStep === "hub" && (
        <MemoryHub
          memories={memories}
          onAddAnother={handleAddAnother}
          setMemories={updateMemories}
        />
      )}
    </div>
  )
}
