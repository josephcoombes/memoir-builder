"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Plus, BookOpen, Sparkles, GripVertical, Trash2 } from "lucide-react"
import type { Memory, Chapter } from "@/app/page"
import { generateChapterIntroduction, generateTransition } from "@/lib/ai-actions"

interface ChapterBuilderProps {
  memories: Memory[]
  chapters: Chapter[]
  setChapters: (chapters: Chapter[]) => void
  onBack: () => void
  onViewBook: () => void
}

export default function ChapterBuilder({ memories, chapters, setChapters, onBack, onViewBook }: ChapterBuilderProps) {
  const [isCreatingChapter, setIsCreatingChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState("")
  const [newChapterDescription, setNewChapterDescription] = useState("")
  const [selectedMemories, setSelectedMemories] = useState<string[]>([])
  const [isGeneratingIntro, setIsGeneratingIntro] = useState(false)
  const [isGeneratingTransition, setIsGeneratingTransition] = useState<string | null>(null)

  const unassignedMemories = memories.filter(
    (memory) => !chapters.some((chapter) => chapter.memoryIds.includes(memory.id)),
  )

  const handleCreateChapter = async () => {
    if (!newChapterTitle.trim() || selectedMemories.length === 0) return

    const newChapter: Chapter = {
      id: Date.now().toString(),
      title: newChapterTitle,
      description: newChapterDescription || undefined,
      memoryIds: selectedMemories,
      transitions: {},
      order: chapters.length,
    }

    // Generate AI introduction
    setIsGeneratingIntro(true)
    try {
      const selectedMemoryObjects = memories.filter((m) => selectedMemories.includes(m.id))
      const introduction = await generateChapterIntroduction(
        newChapterTitle,
        newChapterDescription,
        selectedMemoryObjects,
      )
      newChapter.introduction = introduction
    } catch (error) {
      console.error("Error generating introduction:", error)
    } finally {
      setIsGeneratingIntro(false)
    }

    setChapters([...chapters, newChapter])
    setIsCreatingChapter(false)
    setNewChapterTitle("")
    setNewChapterDescription("")
    setSelectedMemories([])
  }

  const handleDeleteChapter = (chapterId: string) => {
    setChapters(chapters.filter((c) => c.id !== chapterId))
  }

  const handleGenerateTransition = async (chapterId: string, fromMemoryId: string, toMemoryId: string) => {
    setIsGeneratingTransition(`${fromMemoryId}-${toMemoryId}`)

    try {
      const fromMemory = memories.find((m) => m.id === fromMemoryId)
      const toMemory = memories.find((m) => m.id === toMemoryId)

      if (fromMemory && toMemory) {
        const transition = await generateTransition(fromMemory, toMemory)

        setChapters(
          chapters.map((chapter) => {
            if (chapter.id === chapterId) {
              return {
                ...chapter,
                transitions: {
                  ...chapter.transitions,
                  [fromMemoryId]: transition,
                },
              }
            }
            return chapter
          }),
        )
      }
    } catch (error) {
      console.error("Error generating transition:", error)
    } finally {
      setIsGeneratingTransition(null)
    }
  }

  const toggleMemorySelection = (memoryId: string) => {
    setSelectedMemories((prev) =>
      prev.includes(memoryId) ? prev.filter((id) => id !== memoryId) : [...prev, memoryId],
    )
  }

  const getMemoryById = (id: string) => memories.find((m) => m.id === id)

  return (
    <div className="min-h-screen bg-warm-cream p-4 bg-red-50">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Hub
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chapter Builder</h1>
              <p className="text-gray-600 mt-1">Organize your memories into a cohesive narrative</p>
            </div>
          </div>
          <div className="flex gap-3">
            {chapters.length > 0 && (
              <Button onClick={onViewBook} variant="outline" className="bg-white">
                <BookOpen className="mr-2 h-4 w-4" />
                Preview Book
              </Button>
            )}
            <Dialog open={isCreatingChapter} onOpenChange={setIsCreatingChapter}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  New Chapter
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Chapter</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Chapter Title</label>
                    <Input
                      placeholder="e.g., 'Growing Up', 'First Love', 'Learning to Let Go'"
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Description (optional)</label>
                    <Textarea
                      placeholder="What themes or emotions connect these memories?"
                      value={newChapterDescription}
                      onChange={(e) => setNewChapterDescription(e.target.value)}
                      className="min-h-20"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Select Memories ({selectedMemories.length} selected)
                    </label>
                    <div className="max-h-64 overflow-y-auto space-y-2 border rounded-lg p-3">
                      {unassignedMemories.map((memory) => (
                        <div
                          key={memory.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-all ${
                            selectedMemories.includes(memory.id)
                              ? "bg-green-50 border-green-200"
                              : "bg-white border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => toggleMemorySelection(memory.id)}
                        >
                          <p className="font-medium text-sm">{memory.prompt}</p>
                          <p className="text-xs text-gray-500 mt-1">{memory.response.substring(0, 100)}...</p>
                          {memory.category && (
                            <Badge variant="outline" className="mt-2 text-xs">
                              {memory.category}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateChapter}
                      disabled={!newChapterTitle.trim() || selectedMemories.length === 0 || isGeneratingIntro}
                      className="flex-1"
                    >
                      {isGeneratingIntro ? (
                        <>
                          <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                          Creating Chapter...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Create Chapter
                        </>
                      )}
                    </Button>
                    <Button variant="outline" onClick={() => setIsCreatingChapter(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {chapters.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <BookOpen className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Start Building Your Memoir</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Group your memories into chapters to create a flowing narrative. Each chapter can explore a theme, time
                period, or relationship.
              </p>
              <Button onClick={() => setIsCreatingChapter(true)} size="lg" className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Chapter
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {chapters.map((chapter) => (
              <Card key={chapter.id}>
                <CardHeader className="bg-transparent">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{chapter.title}</CardTitle>
                      {chapter.description && <p className="text-gray-600 mt-1">{chapter.description}</p>}
                      <p className="text-sm text-gray-500 mt-2">
                        {chapter.memoryIds.length} {chapter.memoryIds.length === 1 ? "memory" : "memories"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteChapter(chapter.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {chapter.introduction && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-medium text-gray-900 mb-2">Chapter Introduction</h4>
                      <p className="text-gray-800 whitespace-pre-wrap">{chapter.introduction}</p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {chapter.memoryIds.map((memoryId, index) => {
                      const memory = getMemoryById(memoryId)
                      if (!memory) return null

                      const nextMemoryId = chapter.memoryIds[index + 1]
                      const hasTransition = chapter.transitions[memoryId]

                      return (
                        <div key={memoryId} className="space-y-3">
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-start gap-3">
                              <div className="p-1 bg-gray-100 rounded">
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">{memory.prompt}</h5>
                                <p className="text-sm text-gray-600 mt-1">
                                  {memory.aiDraft
                                    ? memory.aiDraft.substring(0, 150) + "..."
                                    : memory.response.substring(0, 150) + "..."}
                                </p>
                              </div>
                            </div>
                          </div>

                          {nextMemoryId && (
                            <div className="ml-8">
                              {hasTransition ? (
                                <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                                  <p className="text-sm text-emerald-800 italic">{hasTransition}</p>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleGenerateTransition(chapter.id, memoryId, nextMemoryId)}
                                  disabled={isGeneratingTransition === `${memoryId}-${nextMemoryId}`}
                                  className="text-green-600 border-green-200 hover:bg-green-50"
                                >
                                  {isGeneratingTransition === `${memoryId}-${nextMemoryId}` ? (
                                    <>
                                      <Sparkles className="mr-2 h-3 w-3 animate-spin" />
                                      Generating...
                                    </>
                                  ) : (
                                    <>
                                      <Sparkles className="mr-2 h-3 w-3" />
                                      Add Transition
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {unassignedMemories.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Unassigned Memories ({unassignedMemories.length})</CardTitle>
              <p className="text-gray-600">These memories haven't been added to any chapter yet.</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {unassignedMemories.map((memory) => (
                  <div key={memory.id} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium text-sm">{memory.prompt}</p>
                    <p className="text-xs text-gray-600 mt-1">{memory.response.substring(0, 100)}...</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
