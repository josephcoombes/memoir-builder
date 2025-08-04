"use client"

import { useState, useEffect } from "react"
import type { Memory, Chapter } from "@/app/page"

export function useLocalStorageData() {
  const [memories, setMemories] = useState<Memory[]>([])
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedMemories = localStorage.getItem("memoir_memories")
      const savedChapters = localStorage.getItem("memoir_chapters")

      if (savedMemories) {
        const parsedMemories = JSON.parse(savedMemories).map((memory: any) => ({
          ...memory,
          timestamp: new Date(memory.timestamp),
          emotions: memory.emotions || [], // Handle existing memories without emotions field
        }))
        setMemories(parsedMemories)
      }

      if (savedChapters) {
        const parsedChapters = JSON.parse(savedChapters)
        setChapters(parsedChapters)
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

  // Save chapters to localStorage whenever they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("memoir_chapters", JSON.stringify(chapters))
      } catch (error) {
        console.error("Error saving chapters to localStorage:", error)
      }
    }
  }, [chapters, isLoading])

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

  const addChapter = async (chapter: Omit<Chapter, "id">) => {
    const newChapter: Chapter = {
      ...chapter,
      id: Date.now().toString(),
    }
    setChapters((prev) => [...prev, newChapter])
    return newChapter.id
  }

  const updateChapter = async (chapterId: string, updates: Partial<Chapter>) => {
    setChapters((prev) => prev.map((chapter) => (chapter.id === chapterId ? { ...chapter, ...updates } : chapter)))
  }

  const deleteChapter = async (chapterId: string) => {
    setChapters((prev) => prev.filter((chapter) => chapter.id !== chapterId))
  }

  const updateMemories = (newMemories: Memory[]) => {
    setMemories(newMemories)
  }

  const updateChapters = (newChapters: Chapter[]) => {
    setChapters(newChapters)
  }

  return {
    memories,
    chapters,
    isLoading,
    addMemory,
    updateMemory,
    deleteMemory,
    addChapter,
    updateChapter,
    deleteChapter,
    updateMemories,
    updateChapters,
    isConfigured: false, // Local storage is always "not configured" for Firebase
  }
}
