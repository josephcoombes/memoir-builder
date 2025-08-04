"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Heart, Gift, Compass } from "lucide-react"
import type { UserIntent } from "@/app/page"

interface IntentSettingProps {
  onIntentSet: (intent: UserIntent) => void
  onBack: () => void
}

export default function IntentSetting({ onIntentSet, onBack }: IntentSettingProps) {
  const intents = [
    {
      id: "make-sense" as UserIntent,
      title: "I want to make sense of my life",
      description: "Explore patterns, growth, and meaning in your experiences",
      icon: Compass,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
    },
    {
      id: "leave-legacy" as UserIntent,
      title: "I want to leave stories behind for someone",
      description: "Create something meaningful for family, friends, or future generations",
      icon: Gift,
      color: "bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    },
    {
      id: "explore-memories" as UserIntent,
      title: "I just want to see what I remember",
      description: "Take a gentle journey through your memories without pressure",
      icon: Heart,
      color: "bg-neutral-50 border-neutral-200 hover:bg-neutral-100",
    },
  ]

  return (
    <div className="min-h-screen bg-warm-cream p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 bg-terracotta hover:bg-terracotta-dark text-white">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-heading font-semibold text-black mb-4 tracking-tight">
            What's bringing you here today?
          </h1>
          <div className="w-16 h-0.5 bg-terracotta mx-auto mb-4"></div>
          <p className="text-lg text-black font-body">
            This helps us tailor the experience to what matters most to you.
          </p>
        </div>

        <div className="space-y-4">
          {intents.map((intent) => {
            const Icon = intent.icon
            return (
              <Card
                key={intent.id}
                className={`cursor-pointer transition-all hover:shadow-lg border-warm-light bg-white hover:bg-terracotta/5 hover:border-terracotta/30`}
                onClick={() => onIntentSet(intent.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-terracotta/10 rounded-lg border border-terracotta/20">
                      <Icon className="h-6 w-6 text-terracotta-dark" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-medium text-black mb-2 text-lg">{intent.title}</h3>
                      <p className="text-black text-sm font-body leading-relaxed">{intent.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
