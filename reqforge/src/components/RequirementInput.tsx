"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Play, FileText, Sparkles } from "lucide-react"

interface RequirementInputProps {
    onGenerate: (req: string) => void
    isGenerating: boolean
}

export function RequirementInput({ onGenerate, isGenerating }: RequirementInputProps) {
    const [input, setInput] = useState("")

    const handleSample = () => {
        setInput("Build an authentication system where users login via OTP, receive a JWT token, and can reset passwords securely.")
    }

    return (
        <div className="flex h-full flex-col">
            {/* Editor Header / Toolbar */}
            <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-md bg-background border px-3 py-1 text-sm text-muted-foreground shadow-sm">
                        <FileText className="h-3 w-3 text-blue-400" />
                        <span>requirements.prompt</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSample} className="h-7 text-xs text-muted-foreground hover:text-foreground">
                        Insert Sample
                    </Button>
                    <div className="h-4 w-[1px] bg-border" />
                    <Button
                        size="sm"
                        onClick={() => onGenerate(input)}
                        disabled={!input || isGenerating}
                        className="h-7 bg-green-600 hover:bg-green-700 text-white gap-2 text-xs"
                    >
                        {isGenerating ? (
                            <Sparkles className="h-3 w-3 animate-spin" />
                        ) : (
                            <Play className="h-3 w-3 fill-current" />
                        )}
                        Run Translation
                    </Button>
                </div>
            </div>

            {/* Editor Body */}
            <div className="relative flex-1 bg-[#0f1117]">
                <div className="absolute left-0 top-0 bottom-0 w-12 border-r bg-muted/10 flex flex-col items-end pt-4 pr-3 text-xs text-muted-foreground/30 font-mono select-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                </div>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="// Describe your feature requirements here...
// Example: Users should be able to login with Google..."
                    className="h-full w-full resize-none border-0 bg-transparent p-4 pl-16 font-mono text-sm leading-6 focus-visible:ring-0 text-gray-300"
                />
            </div>
        </div>
    )
}
