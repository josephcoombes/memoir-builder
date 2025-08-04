"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, Tag, Edit3, Save, X, BookOpen, Filter } from "lucide-react"
import type { Memory } from "@/app/page"

interface MemoryHubProps {
  memories: Memory[]
  onAddAnother: () => void
  setMemories: (memories: Memory[]) => void
  onViewChapters: () => void
  hasChapters: boolean
}

const categoryOptions = [
  { value: "childhood", label: "Childhood", color: "bg-amber-50 text-black border-amber-200" },
  { value: "family", label: "Family", color: "bg-stone-50 text-black border-stone-200" },
  { value: "love", label: "Love & Relationships", color: "bg-rose-50 text-black border-rose-200" },
  { value: "growth", label: "Personal Growth", color: "bg-slate-50 text-black border-slate-200" },
  { value: "challenges", label: "Challenges", color: "bg-orange-50 text-black border-orange-200" },
  { value: "achievements", label: "Achievements", color: "bg-amber-50 text-black border-amber-200" },
  { value: "loss", label: "Loss & Grief", color: "bg-neutral-50 text-black border-neutral-200" },
  { value: "joy", label: "Joy & Celebration", color: "bg-emerald-50 text-black border-emerald-200" },
  { value: "lessons", label: "Life Lessons", color: "bg-indigo-50 text-black border-indigo-200" },
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

export default function MemoryHub({
  memories,
  onAddAnother,
  setMemories,
  onViewChapters,
  hasChapters,
}: MemoryHubProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [newTag, setNewTag] = useState("")
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterTag, setFilterTag] = useState<string>("")
  const [filterEmotion, setFilterEmotion] = useState<string>("all")

  const handleEdit = (memory: Memory) => {
    setEditingId(memory.id)
    setEditingMemory({ ...memory })
  }

  const handleSave = () => {
    if (editingMemory) {
      setMemories(memories.map((m) => (m.id === editingMemory.id ? editingMemory : m)))
      setEditingId(null)
      setEditingMemory(null)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditingMemory(null)
  }

  const addTag = (memoryId: string) => {
    if (newTag.trim()) {
      if (editingMemory && editingMemory.id === memoryId) {
        setEditingMemory({
          ...editingMemory,
          tags: [...editingMemory.tags, newTag.trim()],
        })
      }
      setNewTag("")
    }
  }

  const removeTag = (memoryId: string, tagToRemove: string) => {
    if (editingMemory && editingMemory.id === memoryId) {
      setEditingMemory({
        ...editingMemory,
        tags: editingMemory.tags.filter((tag) => tag !== tagToRemove),
      })
    }
  }

  const updateCategory = (category: string) => {
    if (editingMemory) {
      setEditingMemory({
        ...editingMemory,
        category: category === "none" ? undefined : category,
      })
    }
  }

  const getCategoryStyle = (category?: string) => {
    const option = categoryOptions.find((opt) => opt.value === category)
    return option ? option.color : "bg-warm-paper text-black border-warm-taupe"
  }

  const getCategoryLabel = (category?: string) => {
    const option = categoryOptions.find((opt) => opt.value === category)
    return option ? option.label : "Uncategorized"
  }

  const filteredMemories = memories.filter((memory) => {
    const categoryMatch = filterCategory === "all" || memory.category === filterCategory
    const tagMatch = !filterTag || memory.tags.some((tag) => tag.toLowerCase().includes(filterTag.toLowerCase()))
    const emotionMatch = filterEmotion === "all" || (memory.emotions && memory.emotions.includes(filterEmotion))
    return categoryMatch && tagMatch && emotionMatch
  })

  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags)))
  const allEmotions = Array.from(new Set(memories.flatMap((m) => m.emotions || [])))
  const memoriesByCategory = categoryOptions.reduce(
    (acc, category) => {
      acc[category.value] = memories.filter((m) => m.category === category.value).length
      return acc
    },
    {} as Record<string, number>,
  )
  const memoriesByEmotion = emotionOptions.reduce(
    (acc, emotion) => {
      acc[emotion.value] = memories.filter((m) => m.emotions && m.emotions.includes(emotion.value)).length
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-semibold text-black tracking-tight">Your Memory Hub</h1>
            <div className="w-20 h-0.5 bg-terracotta mt-2 mb-3"></div>
            <p className="text-black font-body">
              {memories.length} {memories.length === 1 ? "memory" : "memories"} woven into your tapestry
            </p>
          </div>
          <div className="flex gap-3">
            {memories.length >= 3 && (
              <Button
                onClick={onViewChapters}
                variant="outline"
                className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
              >
                <BookOpen className="mr-2 h-4 w-4" />
                {hasChapters ? "Edit Chapters" : "Create Chapters"}
              </Button>
            )}
            <Button
              onClick={onAddAnother}
              className="bg-terracotta hover:bg-terracotta-dark text-white font-medium shadow-lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add memory
            </Button>
          </div>
        </div>

        {/* Filters and Categories Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card className="border-warm-taupe bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-heading text-black">
                  <Filter className="h-5 w-5" />
                  Organize
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-black mb-2 block font-body">Filter by Category</label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="border-terracotta focus:ring-terracotta/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories ({memories.length})</SelectItem>
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label} ({memoriesByCategory[category.value] || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-black mb-2 block font-body">Filter by Tag</label>
                  <Input
                    placeholder="Search tags..."
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-black mb-2 block font-body">Filter by Emotion</label>
                  <Select value={filterEmotion} onValueChange={setFilterEmotion}>
                    <SelectTrigger className="border-terracotta focus:ring-terracotta/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Emotions ({memories.length})</SelectItem>
                      {emotionOptions.filter(emotion => memoriesByEmotion[emotion.value] > 0).map((emotion) => (
                        <SelectItem key={emotion.value} value={emotion.value}>
                          {emotion.emoji} {emotion.label} ({memoriesByEmotion[emotion.value] || 0})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {(filterCategory !== "all" || filterTag !== "" || filterEmotion !== "all") && (
                  <div className="pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterCategory("all")
                        setFilterTag("")
                        setFilterEmotion("all")
                      }}
                      className="text-terracotta text-white hover:bg-terracotta-pale hover:text-white text-sm"
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}

                {allTags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block font-body">Popular Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {allTags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="cursor-pointer hover:bg-terracotta-pale border-warm-taupe text-black"
                          onClick={() => setFilterTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            {filteredMemories.length === 0 ? (
              <Card className="text-center py-12 border-warm-taupe bg-white">
                <CardContent>
                  <p className="text-black mb-4 font-body">
                    {memories.length === 0 ? "No memories yet" : "No memories match your filters"}
                  </p>
                  <Button onClick={onAddAnother} className="bg-terracotta hover:bg-terracotta-dark text-white">
                    {memories.length === 0 ? "Start with your first memory" : "Add another memory"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredMemories.map((memory) => (
                  <Card key={memory.id} className="relative border-warm-taupe bg-white shadow-sm">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2 font-heading text-black leading-relaxed">
                            {memory.prompt}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-black mb-2 font-body">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {memory.timestamp.toLocaleDateString()}
                            </div>
                            {memory.tone && (
                              <Badge variant="secondary" className="bg-sage/20 text-black border-sage/30">
                                {memory.tone} tone
                              </Badge>
                            )}
                          </div>
                          {memory.category && (
                            <Badge className={getCategoryStyle(memory.category)}>
                              {getCategoryLabel(memory.category)}
                            </Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(memory)}
                          className="text-black hover:text-white hover:bg-terracotta"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {editingId === memory.id && editingMemory ? (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Category</label>
                            <Select value={editingMemory.category || "none"} onValueChange={updateCategory}>
                              <SelectTrigger className="border-terracotta focus:ring-terracotta/20">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="none">No Category</SelectItem>
                                {categoryOptions.map((category) => (
                                  <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Your Response</label>
                            <Textarea
                              value={editingMemory.response}
                              onChange={(e) =>
                                setEditingMemory({
                                  ...editingMemory,
                                  response: e.target.value,
                                })
                              }
                              className="min-h-24 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                            />
                          </div>

                          {editingMemory.aiDraft && (
                            <div>
                              <label className="text-sm font-medium text-black mb-2 block font-body">AI Draft</label>
                              <Textarea
                                value={editingMemory.aiDraft}
                                onChange={(e) =>
                                  setEditingMemory({
                                    ...editingMemory,
                                    aiDraft: e.target.value,
                                  })
                                }
                                className="min-h-32 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                              />
                            </div>
                          )}

                          {editingMemory.reflection && (
                            <div>
                              <label className="text-sm font-medium text-black mb-2 block font-body">Reflection</label>
                              <Textarea
                                value={editingMemory.reflection}
                                onChange={(e) =>
                                  setEditingMemory({
                                    ...editingMemory,
                                    reflection: e.target.value,
                                  })
                                }
                                className="min-h-20 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                              />
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Emotions</label>
                            <div className="flex flex-wrap gap-1">
                              {emotionOptions.map((emotion) => (
                                <button
                                  key={emotion.value}
                                  type="button"
                                  onClick={() => {
                                    if (editingMemory) {
                                      const currentEmotions = editingMemory.emotions || []
                                      const newEmotions = currentEmotions.includes(emotion.value)
                                        ? currentEmotions.filter(e => e !== emotion.value)
                                        : [...currentEmotions, emotion.value]
                                      setEditingMemory({
                                        ...editingMemory,
                                        emotions: newEmotions,
                                      })
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-body transition-all ${
                                    editingMemory?.emotions?.includes(emotion.value)
                                      ? 'bg-amber-100 text-black border-2 border-terracotta shadow-md font-medium'
                                      : 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300'
                                  }`}
                                >
                                  <span className="text-sm">{emotion.emoji}</span>
                                  <span>{emotion.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editingMemory.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="gap-1 border-warm-taupe text-black hover:bg-terracotta-pale">
                                  <Tag className="h-3 w-3" />
                                  {tag}
                                  <button onClick={() => removeTag(memory.id, tag)} className="ml-1 hover:text-red-500">
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a tag..."
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addTag(memory.id)}
                                className="flex-1 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                              />
                              <Button
                                variant="outline"
                                onClick={() => addTag(memory.id)}
                                disabled={!newTag.trim()}
                                className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                              >
                                Add
                              </Button>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button onClick={handleSave} className="bg-terracotta hover:bg-terracotta-dark text-white">
                              <Save className="mr-2 h-4 w-4" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              onClick={handleCancel}
                              className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-black mb-2 font-body">Your Response</h4>
                            <p className="text-black bg-warm-paper p-3 rounded-lg font-body leading-relaxed">
                              {memory.response}
                            </p>
                          </div>

                          {memory.aiDraft && (
                            <div>
                              <h4 className="font-medium text-black mb-2 font-body">Memory Story</h4>
                              <div className="bg-terracotta/5 p-4 rounded-lg border border-terracotta/20">
                                <p className="whitespace-pre-wrap text-black font-body leading-relaxed">
                                  {memory.aiDraft}
                                </p>
                              </div>
                            </div>
                          )}

                          {memory.reflection && (
                            <div>
                              <h4 className="font-medium text-black mb-2 font-body">Reflection</h4>
                              <p className="text-black bg-sage/10 p-3 rounded-lg border border-sage/20 font-body leading-relaxed">
                                {memory.reflection}
                              </p>
                            </div>
                          )}

                          {memory.emotions && memory.emotions.length > 0 && (
                            <div className="mb-3">
                              <h5 className="text-xs font-medium text-black mb-2 font-body">Emotions</h5>
                              <div className="flex flex-wrap gap-1">
                                {memory.emotions.map((emotion) => {
                                  const emotionOption = emotionOptions.find(opt => opt.value === emotion)
                                  return (
                                    <span 
                                      key={emotion} 
                                      className="inline-flex items-center gap-1 bg-warm-paper px-2 py-1 rounded-full text-xs text-black"
                                    >
                                      <span>{emotionOption?.emoji}</span>
                                      <span>{emotionOption?.label}</span>
                                    </span>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {memory.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {memory.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="bg-warm-paper text-black">
                                  <Tag className="mr-1 h-3 w-3" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {memories.length >= 3 && (
          <div className="text-center py-12 bg-white rounded-lg border border-terracotta/20 shadow-sm">
            <BookOpen className="h-12 w-12 text-terracotta-dark mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-black mb-2 font-heading">Ready to weave your story?</h3>
            <p className="text-black mb-6 font-body">
              You have {memories.length} memories. Let's organize them into chapters and create your memoir.
            </p>
            <Button
              onClick={onViewChapters}
              size="lg"
              className="bg-terracotta hover:bg-terracotta-dark text-white font-medium shadow-lg"
            >
              <BookOpen className="mr-2 h-5 w-5" />
              {hasChapters ? "Continue Building Chapters" : "Start Creating Chapters"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
