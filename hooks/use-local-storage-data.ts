"use client"

import { useState, useEffect } from "react"
import type { Memory } from "@/app/page"

export function useLocalStorageData() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedMemories = localStorage.getItem("memoir_memories")

      if (savedMemories) {
        const parsedMemories = JSON.parse(savedMemories).map((memory: any) => ({
          ...memory,
          timestamp: new Date(memory.timestamp),
          memoryDate: memory.memoryDate ? new Date(memory.memoryDate) : undefined,
          emotions: memory.emotions || [], // Handle existing memories without emotions field
          people: memory.people || [], // Handle existing memories without people field
          followUpQuestions: memory.followUpQuestions || undefined, // Handle existing memories without followUpQuestions field
          followUpResponses: memory.followUpResponses || [], // Handle existing memories without followUpResponses field
          additionalThoughts: memory.additionalThoughts || undefined, // Handle existing memories without additionalThoughts field
        }))
        setMemories(parsedMemories)
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save memories to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("memoir_memories", JSON.stringify(memories))
      } catch (error) {
        console.error("Error saving memories to localStorage:", error)
      }
    }
  }, [memories, isLoading])



  const addMemory = async (memory: Omit<Memory, "id">) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
    }
    setMemories((prev) => [newMemory, ...prev])
  }

  const updateMemory = async (memoryId: string, updates: Partial<Memory>) => {
    setMemories((prev) => prev.map((memory) => (memory.id === memoryId ? { ...memory, ...updates } : memory)))
  }

  const deleteMemory = async (memoryId: string) => {
    setMemories((prev) => prev.filter((memory) => memory.id !== memoryId))
  }

  const updateMemories = (newMemories: Memory[]) => {
    setMemories(newMemories)
  }

  return {
    memories,
    isLoading,
    addMemory,
    updateMemory,
    deleteMemory,
    updateMemories,
    isConfigured: false, // Local storage is always "not configured" for Firebase
  }
}
