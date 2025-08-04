"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Heart, Menu, X } from "lucide-react"
import TapestryLogo from "@/components/tapestry-logo"

interface NavigationProps {
  currentStep: "welcome" | "prompt" | "hub"
  onNavigate: (step: "welcome" | "prompt" | "hub") => void
  memoriesCount?: number
}

export default function Navigation({ currentStep, onNavigate, memoriesCount = 0 }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    {
      key: "prompt" as const, 
      label: "Add Memory",
      icon: Plus,
      className: "text-black hover:text-terracotta"
    },
    {
      key: "hub" as const,
      label: `Keepsake ${memoriesCount > 0 ? `(${memoriesCount})` : ''}`,
      icon: Heart,
      className: memoriesCount > 0 ? "text-black hover:text-terracotta" : "text-gray-400 cursor-not-allowed",
      disabled: memoriesCount === 0
    }
  ]

  return (
    <nav className="bg-white border-b border-warm-taupe/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Clickable */}
          <button 
            onClick={() => onNavigate("welcome")}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <TapestryLogo size={24} />
            <span className="text-xl font-heading font-semibold text-black">Keepsake</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = currentStep === item.key
              
              return (
                <Button
                  key={item.key}
                  variant="ghost"
                  onClick={() => !item.disabled && onNavigate(item.key)}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-terracotta/10 text-terracotta border border-terracotta/20' 
                      : item.className
                    }
                    ${item.disabled ? 'pointer-events-none' : ''}
                  `}
                  disabled={item.disabled}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Button>
              )
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-black hover:text-terracotta"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-warm-taupe/20 py-3">
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = currentStep === item.key
                
                return (
                  <Button
                    key={item.key}
                    variant="ghost"
                    onClick={() => {
                      if (!item.disabled) {
                        onNavigate(item.key)
                        setIsMobileMenuOpen(false)
                      }
                    }}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-lg transition-all justify-start w-full
                      ${isActive 
                        ? 'bg-terracotta/10 text-terracotta border border-terracotta/20' 
                        : item.className
                      }
                      ${item.disabled ? 'pointer-events-none' : ''}
                    `}
                    disabled={item.disabled}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="font-medium text-left">{item.label}</span>
                  </Button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 