"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { FileText, Code, AlertTriangle, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface RequirementInputProps {
    onGenerate: (req: string) => void
    isGenerating: boolean
}

export function RequirementInput({ onGenerate, isGenerating }: RequirementInputProps) {
    const [input, setInput] = useState("")
    const [selectedModes, setSelectedModes] = useState<string[]>(["stories", "apis", "edge-cases"])

    const toggleMode = (mode: string) => {
        setSelectedModes(prev =>
            prev.includes(mode) ? prev.filter(m => m !== mode) : [...prev, mode]
        )
    }

    const handleSample = () => {
        setInput("Build an authentication system where users login via OTP, receive a JWT token, and can reset passwords securely.")
    }

    return (
        <div className="flex flex-1 flex-col items-center justify-center p-8">
            <div className="w-full max-w-2xl space-y-8">
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-semibold tracking-tight">Translate requirements into specs</h2>
                    <p className="text-muted-foreground">Paste ambiguous business requirements and convert them into structured developer-ready outputs.</p>
                </div>

                <div className="flex justify-center gap-2">
                    <Badge
                        variant={selectedModes.includes("stories") ? "default" : "outline"}
                        className="cursor-pointer gap-1 px-3 py-1"
                        onClick={() => toggleMode("stories")}
                    >
                        <FileText className="h-3 w-3" /> User Stories
                    </Badge>
                    <Badge
                        variant={selectedModes.includes("apis") ? "default" : "outline"}
                        className="cursor-pointer gap-1 px-3 py-1"
                        onClick={() => toggleMode("apis")}
                    >
                        <Code className="h-3 w-3" /> API Specs
                    </Badge>
                    <Badge
                        variant={selectedModes.includes("edge-cases") ? "default" : "outline"}
                        className="cursor-pointer gap-1 px-3 py-1"
                        onClick={() => toggleMode("edge-cases")}
                    >
                        <AlertTriangle className="h-3 w-3" /> Edge Cases
                    </Badge>
                </div>

                <div className="relative rounded-xl border bg-card p-4 shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Example: Users should be able to sign up with OTP, receive a token, and access a personalized dashboard..."
                        className="min-h-[240px] resize-none border-0 bg-transparent p-4 focus-visible:ring-0 text-base"
                    />
                    <div className="absolute bottom-4 right-4 left-4 flex justify-between items-center">
                        <Button variant="ghost" size="sm" onClick={handleSample} className="text-xs text-muted-foreground hover:text-foreground">
                            Try Sample Requirement
                        </Button>
                        <Button
                            size="lg"
                            onClick={() => onGenerate(input)}
                            disabled={!input || isGenerating}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]"
                        >
                            {isGenerating ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generating...
                                </>
                            ) : (
                                "Generate Engineering Plan"
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
