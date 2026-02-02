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
        <div className="flex h-full flex-col bg-[#050505]">
            {/* Editor Header / Toolbar */}
            <div className="flex items-center justify-between border-b border-[#08CB00]/20 bg-black/50 px-4 py-2">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 rounded-sm bg-[#08CB00]/10 border border-[#08CB00]/30 px-3 py-1 text-sm text-[#08CB00] shadow-[0_0_10px_rgba(8,203,0,0.1)]">
                        <FileText className="h-3 w-3" />
                        <span>requirements.prompt</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={handleSample} className="h-7 text-xs text-gray-500 hover:text-[#08CB00] hover:bg-[#08CB00]/10">
                        Insert Sample
                    </Button>
                    <div className="h-4 w-[1px] bg-[#08CB00]/20" />
                    <Button
                        size="sm"
                        onClick={() => onGenerate(input)}
                        disabled={!input || isGenerating}
                        className="h-7 bg-[#08CB00] hover:bg-[#08CB00]/80 text-black font-bold gap-2 text-xs shadow-[0_0_15px_rgba(8,203,0,0.4)] transition-all hover:scale-105"
                    >
                        {isGenerating ? (
                            <Sparkles className="h-3 w-3 animate-spin" />
                        ) : (
                            <Play className="h-3 w-3 fill-current" />
                        )}
                        COMPILE SPECS
                    </Button>
                </div>
            </div>

            {/* Editor Body */}
            <div className="relative flex-1 bg-[#050505]">
                <div className="absolute left-0 top-0 bottom-0 w-12 border-r border-[#08CB00]/10 bg-black/40 flex flex-col items-end pt-4 pr-3 text-xs text-gray-700 font-mono select-none">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="leading-6">{i + 1}</div>
                    ))}
                </div>
                <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="// Describe your feature requirements here...
// Example: Users should be able to login with Google..."
                    className="h-full w-full resize-none border-0 bg-transparent p-4 pl-16 font-mono text-sm leading-6 focus-visible:ring-0 text-gray-300 placeholder:text-gray-700"
                />
            </div>
        </div>
    )
}
