"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Plus, Calendar, Edit3, Save, X, Filter, Trash2 } from "lucide-react"
import type { Memory } from "@/app/page"

interface MemoryHubProps {
  memories: Memory[]
  onAddAnother: () => void
  setMemories: (memories: Memory[]) => void
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
}: MemoryHubProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [newTag, setNewTag] = useState("")
  const [newPerson, setNewPerson] = useState("")
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [memoryToDelete, setMemoryToDelete] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string>("all")
  const [filterTag, setFilterTag] = useState<string>("")
  const [filterEmotion, setFilterEmotion] = useState<string>("all")
  const [filterPerson, setFilterPerson] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

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

  const addPerson = (memoryId: string) => {
    if (newPerson.trim()) {
      if (editingMemory && editingMemory.id === memoryId) {
        const currentPeople = editingMemory.people || []
        if (!currentPeople.includes(newPerson.trim())) {
          setEditingMemory({
            ...editingMemory,
            people: [...currentPeople, newPerson.trim()],
          })
        }
      }
      setNewPerson("")
    }
  }

  const handleDeleteMemory = (memoryId: string) => {
    setMemoryToDelete(memoryId)
    setDeleteConfirmOpen(true)
  }

  const confirmDeleteMemory = () => {
    if (memoryToDelete) {
      const updatedMemories = memories.filter(m => m.id !== memoryToDelete)
      setMemories(updatedMemories)
      setMemoryToDelete(null)
      setDeleteConfirmOpen(false)
      // If we were editing the deleted memory, cancel edit mode
      if (editingId === memoryToDelete) {
        setEditingId(null)
        setEditingMemory(null)
      }
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
    const personMatch = filterPerson === "all" || (memory.people && memory.people.includes(filterPerson))
    return categoryMatch && tagMatch && emotionMatch && personMatch
  }).sort((a, b) => {
    switch (sortBy) {
      case "oldest":
        return (a.memoryDate || a.timestamp).getTime() - (b.memoryDate || b.timestamp).getTime()
      case "newest":
        return (b.memoryDate || b.timestamp).getTime() - (a.memoryDate || a.timestamp).getTime()
      case "chronological":
        return (a.memoryDate || a.timestamp).getTime() - (b.memoryDate || b.timestamp).getTime()
      default:
        return (b.timestamp).getTime() - (a.timestamp).getTime()
    }
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredMemories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedMemories = filteredMemories.slice(startIndex, endIndex)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filterCategory, filterTag, filterEmotion, filterPerson, sortBy])

  const allTags = Array.from(new Set(memories.flatMap((m) => m.tags)))
  const allEmotions = Array.from(new Set(memories.flatMap((m) => m.emotions || [])))
  const allPeople = Array.from(new Set(memories.flatMap((m) => m.people || [])))
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
    <div className="bg-warm-cream p-4" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <div className="max-w-6xl mx-auto pt-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-semibold text-black tracking-tight">Keepsake</h1>
            <div className="w-20 h-0.5 bg-terracotta mt-2 mb-3"></div>
            <p className="text-black font-body">You currently have&nbsp;
              {memories.length} {memories.length === 1 ? "memory" : "memories"} in your Keepsake.
            </p>
          </div>
        </div>

        {/* Filters and Categories Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-1">
            <Card className="border-warm-taupe bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 font-heading text-black">
                  
                  Organize your memories
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

                <div>
                  <label className="text-sm font-medium text-black mb-2 block font-body">Sort by</label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="border-terracotta focus:ring-terracotta/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Most Recent First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>



                {allPeople.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block font-body">Filter by Person</label>
                    <Select value={filterPerson} onValueChange={setFilterPerson}>
                      <SelectTrigger className="border-terracotta focus:ring-terracotta/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All People ({memories.length})</SelectItem>
                        {allPeople.map((person) => {
                          const count = memories.filter(m => m.people && m.people.includes(person)).length
                          return (
                            <SelectItem key={person} value={person}>
                              {person} ({count})
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                )}

<div className="pt-2">
                  <label className="text-sm font-medium text-black mb-2 block font-body">Filter by Tag</label>
                  <Input
                    placeholder="Search tags..."
                    value={filterTag}
                    onChange={(e) => setFilterTag(e.target.value)}
                    className="bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                  />
                </div>
                {allTags.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-black mb-2 block font-body">Popular Tags</label>
                    <div className="flex flex-wrap gap-1">
                      {allTags.slice(0, 10).map((tag) => (
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

                {(filterCategory !== "all" || filterTag !== "" || filterEmotion !== "all" || filterPerson !== "all") && (
                  <div className="pt-4 border-t border-warm-taupe/20 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFilterCategory("all")
                        setFilterTag("")
                        setFilterEmotion("all")
                        setFilterPerson("all")
                        setSortBy("newest")
                      }}
                      className="w-full text-terracotta hover:bg-terracotta-pale hover:text-black border-terracotta/30"
                    >
                      Clear all filters
                    </Button>
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
              <>
                <div className="grid gap-6">
                  {paginatedMemories.map((memory) => (
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
                              {memory.memoryDate ? memory.memoryDate.toLocaleDateString() : memory.timestamp.toLocaleDateString()}
                            </div>
                            {memory.memoryDate && (
                              <span className="text-xs text-black/60">
                                Added {memory.timestamp.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          {memory.category && (
                            <Badge className={getCategoryStyle(memory.category)}>
                              {getCategoryLabel(memory.category)}
                            </Badge>
                          )}
                        </div>
                        {editingId === memory.id ? (
                          <div className="flex gap-2">
                            <Button 
                              onClick={handleSave} 
                              size="sm"
                              className="bg-terracotta hover:bg-terracotta-dark text-white"
                            >
                              <Save className="mr-1 h-3 w-3" />
                              Save
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleCancel}
                              className="bg-terracotta/20 hover:bg-terracotta/50 border-terracotta"
                            >
                              <X className="mr-1 h-3 w-3" />
                              Cancel
                            </Button>
                            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteMemory(memory.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                >
                                  <Trash2 className="mr-1 h-3 w-3" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Memory</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this memory? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={confirmDeleteMemory}
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        ) : (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(memory)}
                            className="text-black hover:text-white hover:bg-terracotta"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        )}
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
                            <label className="text-sm font-medium text-black mb-2 block font-body">Memory Date (optional)</label>
                            <Input
                              type="date"
                              value={editingMemory.memoryDate ? editingMemory.memoryDate.toISOString().split('T')[0] : ""}
                              onChange={(e) => {
                                if (editingMemory) {
                                  setEditingMemory({
                                    ...editingMemory,
                                    memoryDate: e.target.value ? new Date(e.target.value) : undefined,
                                  })
                                }
                              }}
                              className="bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                            />
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



                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Additional Thoughts</label>
                            <div className="space-y-3">
                              {editingMemory.followUpResponses?.map((response, index) => (
                                <div key={index} className="bg-amber/5 p-3 rounded-lg border border-amber/10">
                                  {editingMemory.followUpQuestions?.[index] && (
                                    <p className="text-black font-medium mb-2 text-sm font-body">
                                      {editingMemory.followUpQuestions[index]}
                                    </p>
                                  )}
                                  <Textarea
                                    value={response}
                                    onChange={(e) => {
                                      const newResponses = [...(editingMemory.followUpResponses || [])]
                                      newResponses[index] = e.target.value
                                      setEditingMemory({
                                        ...editingMemory,
                                        followUpResponses: newResponses,
                                      })
                                    }}
                                    className="min-h-16 bg-white border-amber/20 focus:border-terracotta focus:ring-terracotta/20 text-sm"
                                  />
                                </div>
                              ))}
                              <div className="bg-amber/10 p-3 rounded-lg border border-amber/20">
                                <p className="text-black font-medium mb-2 text-sm font-body">
                                  Additional reflections:
                                </p>
                                <Textarea
                                  value={editingMemory.additionalThoughts || ""}
                                  onChange={(e) =>
                                    setEditingMemory({
                                      ...editingMemory,
                                      additionalThoughts: e.target.value,
                                    })
                                  }
                                  placeholder="Any other details, feelings, or thoughts about this memory..."
                                  className="min-h-20 bg-white border-amber/20 focus:border-terracotta focus:ring-terracotta/20"
                                />
                              </div>
                            </div>
                          </div>

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
                                      ? 'bg-gray-100 text-black border-2 border-terracotta opacity-100'
                                      : 'bg-gray-100 hover:bg-gray-200 text-black border border-gray-300 opacity-60 hover:opacity-80'
                                  }`}
                                >
                                  <span className="text-sm">{emotion.emoji}</span>
                                  <span>{emotion.label}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">People</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editingMemory?.people && editingMemory.people.map((person, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="gap-1 border-warm-taupe text-black hover:bg-terracotta-pale"
                                >
                                  👤 {person}
                                  <button 
                                    onClick={() => {
                                      if (editingMemory) {
                                        setEditingMemory({
                                          ...editingMemory,
                                          people: editingMemory.people?.filter(p => p !== person) || [],
                                        })
                                      }
                                    }} 
                                    className="ml-1 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Input
                                placeholder="Add a person..."
                                value={newPerson}
                                onChange={(e) => setNewPerson(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && addPerson(memory.id)}
                                className="flex-1 bg-warm-paper border-warm-taupe focus:border-terracotta focus:ring-terracotta/20"
                              />
                              <Button
                                variant="outline"
                                onClick={() => addPerson(memory.id)}
                                disabled={!newPerson.trim()}
                                className="bg-terracotta hover:bg-terracotta-dark text-white border-terracotta"
                              >
                                Add
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-black mb-2 block font-body">Tags</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {editingMemory.tags.map((tag) => (
                                <Badge key={tag} variant="outline" className="gap-1 border-warm-taupe text-black hover:bg-terracotta-pale">
                                  <span className="mr-1">🏷️</span>
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


                        </div>
                      ) : (
                        <div className="space-y-3">
                          {/* Condensed Response Preview */}
                          <div>
                            <p className="text-black font-body leading-relaxed line-clamp-3">
                              {memory.response.length > 150 
                                ? `${memory.response.substring(0, 150)}...` 
                                : memory.response
                              }
                            </p>
                          </div>

                          {/* Condensed Metadata */}
                          <div className="flex flex-wrap gap-2 items-center">
                            {/* Emotions Preview */}
                            {memory.emotions && memory.emotions.length > 0 && (
                              <div className="flex items-center gap-1">
                                {memory.emotions.slice(0, 3).map((emotion) => {
                                  const emotionOption = emotionOptions.find(opt => opt.value === emotion)
                                  return (
                                    <Badge 
                                      key={emotion} 
                                      variant="secondary" 
                                      className="bg-warm-paper text-black text-xs"
                                    >
                                      <span className="mr-1">{emotionOption?.emoji}</span>
                                      {emotionOption?.label}
                                    </Badge>
                                  )
                                })}
                                {memory.emotions.length > 3 && (
                                  <span className="text-xs text-gray-600">+{memory.emotions.length - 3} more</span>
                                )}
                              </div>
                            )}

                            {/* People Preview */}
                            {memory.people && memory.people.length > 0 && (
                              <div className="flex items-center gap-1">
                                {memory.people.slice(0, 2).map((person) => (
                                  <Badge 
                                    key={person} 
                                    variant="secondary" 
                                    className="bg-warm-paper text-black text-xs"
                                  >
                                    <span className="mr-1">👤</span>
                                    {person}
                                  </Badge>
                                ))}
                                {memory.people.length > 2 && (
                                  <span className="text-xs text-gray-600">+{memory.people.length - 2} more</span>
                                )}
                              </div>
                            )}

                            {/* Tags Preview */}
                            {memory.tags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {memory.tags.slice(0, 2).map((tag) => (
                                  <Badge key={tag} variant="secondary" className="bg-warm-paper text-black text-xs">
                                    <span className="mr-1">🏷️</span>
                                    {tag}
                                  </Badge>
                                ))}
                                {memory.tags.length > 2 && (
                                  <span className="text-xs text-gray-600">+{memory.tags.length - 2} more</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-warm-taupe/20">
                  <div className="text-sm text-black font-body">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredMemories.length)} of {filteredMemories.length} memories.
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-black">
                      <span>Show:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                        <SelectTrigger className="w-20 h-8 border-terracotta focus:ring-terracotta/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="20">20</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="border-terracotta text-terracotta hover:bg-terracotta/10 hover:text-terracotta-dark disabled:opacity-50"
                      >
                        Previous
                      </Button>
                      <div className="flex gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(pageNum)}
                              className={
                                currentPage === pageNum
                                  ? "bg-terracotta hover:bg-terracotta-dark text-white"
                                  : "border-terracotta text-terracotta hover:bg-terracotta/10 hover:text-terracotta-dark"
                              }
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="border-terracotta text-terracotta hover:bg-terracotta/10 hover:text-terracotta-dark disabled:opacity-50"
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  </div>
  )
}
