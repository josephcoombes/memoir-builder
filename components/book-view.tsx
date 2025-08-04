"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Download, Share2, BookOpen } from "lucide-react"
import type { Memory, Chapter, UserIntent } from "@/app/page"

interface BookViewProps {
  memories: Memory[]
  chapters: Chapter[]
  onBack: () => void
  userIntent: UserIntent
}

export default function BookView({ memories, chapters, onBack, userIntent }: BookViewProps) {
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  const getMemoryById = (id: string) => memories.find((m) => m.id === id)

  const getIntentTitle = (intent: UserIntent) => {
    switch (intent) {
      case "make-sense":
        return "Making Sense of My Life"
      case "leave-legacy":
        return "Stories for Those I Love"
      case "explore-memories":
        return "A Journey Through Memory"
      default:
        return "My Memoir"
    }
  }

  const handleExport = () => {
    // Create a simple text version for now
    let content = `${getIntentTitle(userIntent)}\n\n`

    chapters.forEach((chapter, index) => {
      content += `Chapter ${index + 1}: ${chapter.title}\n`
      content += "=".repeat(chapter.title.length + 15) + "\n\n"

      if (chapter.introduction) {
        content += chapter.introduction + "\n\n"
      }

      chapter.memoryIds.forEach((memoryId, memIndex) => {
        const memory = getMemoryById(memoryId)
        if (memory) {
          if (memory.aiDraft) {
            content += memory.aiDraft + "\n\n"
          } else {
            content += memory.response + "\n\n"
          }

          if (chapter.transitions[memoryId]) {
            content += chapter.transitions[memoryId] + "\n\n"
          }

          if (memory.reflection) {
            content += "Reflection: " + memory.reflection + "\n\n"
          }
        }
      })

      content += "\n"
    })

    // Create and download the file
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${getIntentTitle(userIntent).replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (selectedChapter) {
    const chapter = chapters.find((c) => c.id === selectedChapter)
    if (!chapter) return null

    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="ghost" onClick={() => setSelectedChapter(null)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Book
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{chapter.title}</h1>
              <p className="text-gray-600">Chapter {chapters.findIndex((c) => c.id === chapter.id) + 1}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            {chapter.introduction && (
              <div className="mb-8">
                <p className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap">{chapter.introduction}</p>
              </div>
            )}

            <div className="space-y-8">
              {chapter.memoryIds.map((memoryId, index) => {
                const memory = getMemoryById(memoryId)
                if (!memory) return null

                return (
                  <div key={memoryId} className="space-y-4">
                    <div className="prose prose-lg max-w-none">
                      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                        {memory.aiDraft || memory.response}
                      </p>
                    </div>

                    {memory.reflection && (
                      <div className="bg-emerald-50 p-4 rounded-lg border-l-4 border-emerald-200">
                        <p className="text-emerald-800 italic">{memory.reflection}</p>
                      </div>
                    )}

                    {chapter.transitions[memoryId] && (
                      <div className="text-center">
                        <p className="text-gray-600 italic">{chapter.transitions[memoryId]}</p>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Chapters
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{getIntentTitle(userIntent)}</h1>
              <p className="text-gray-600 mt-1">Your memoir in {chapters.length} chapters</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport} className="bg-white">
              <Download className="mr-2 h-4 w-4" />
              Export as Text
            </Button>
            <Button variant="outline" className="bg-white">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Table of Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setSelectedChapter(chapter.id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-green-50 transition-colors"
                    >
                      <div className="text-sm font-medium text-gray-900">Chapter {index + 1}</div>
                      <div className="text-sm text-gray-600 truncate">{chapter.title}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {chapter.memoryIds.length} {chapter.memoryIds.length === 1 ? "memory" : "memories"}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Book Preview */}
          <div className="lg:col-span-3">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8">
                <div className="text-center mb-12">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{getIntentTitle(userIntent)}</h1>
                  <div className="w-24 h-1 bg-green-600 mx-auto mb-8"></div>
                  <p className="text-gray-600 text-lg">A collection of memories and reflections</p>
                </div>

                <div className="space-y-12">
                  {chapters.map((chapter, index) => (
                    <div key={chapter.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                          Chapter {index + 1}: {chapter.title}
                        </h2>
                        {chapter.description && <p className="text-gray-600 italic">{chapter.description}</p>}
                      </div>

                      {chapter.introduction && (
                        <div className="mb-6">
                          <p className="text-gray-800 leading-relaxed">
                            {chapter.introduction.substring(0, 300)}
                            {chapter.introduction.length > 300 && "..."}
                          </p>
                        </div>
                      )}

                      <div className="text-sm text-gray-500 mb-4">
                        {chapter.memoryIds.length} {chapter.memoryIds.length === 1 ? "memory" : "memories"} in this
                        chapter
                      </div>

                      <Button
                        variant="outline"
                        onClick={() => setSelectedChapter(chapter.id)}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        Read Chapter
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="text-center mt-16 pt-8 border-t border-gray-200">
                  <p className="text-gray-600 italic">"Every memory is a thread in the tapestry of our lives."</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
