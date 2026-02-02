"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare, Box } from "lucide-react"
import NeuralBackground from "@/components/NeuralBackground"

export function Sidebar() {
    return (
        <div className="relative flex h-full w-[260px] flex-col border-r border-[#08CB00]/20 bg-black">

            {/* Background Effect Layer */}
            <div className="absolute inset-0 z-0">
                <NeuralBackground
                    color="#08CB00"
                    speed={0.5}
                    particleCount={400}
                    trailOpacity={0.2}
                />
                {/* Overlay to ensure text readability */}
                <div className="absolute inset-0 bg-black/60" />
            </div>

            {/* Content Layer */}
            <div className="relative z-10 flex h-full flex-col">
                <div className="p-4">
                    <div className="mb-6 flex items-center gap-3 px-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#08CB00]/20 border border-[#08CB00]/50 shadow-[0_0_15px_rgba(8,203,0,0.3)]">
                            <Box className="h-5 w-5 text-[#08CB00]" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold tracking-widest text-[#08CB00]">DEVBRIDGE</h1>
                            <p className="text-[9px] text-muted-foreground uppercase tracking-widest">AI Architect Core</p>
                        </div>
                    </div>
                    <Button className="w-full justify-start gap-2 border-[#08CB00]/30 hover:bg-[#08CB00]/10 hover:text-[#08CB00]" variant="outline">
                        <Plus className="h-4 w-4" />
                        New Architecture
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-2">
                    <div className="space-y-1 p-2">
                        <p className="px-2 text-[10px] font-bold uppercase text-muted-foreground/70 mb-2 tracking-wider">Recents</p>
                        {["Payment Gateway Flow", "User Dashboard", "Auth Microservice", "Subscription Engine"].map((item, i) => (
                            <Button
                                key={i}
                                variant="ghost"
                                className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal text-gray-400 hover:text-[#08CB00] hover:bg-[#08CB00]/5 transition-colors"
                            >
                                <MessageSquare className="h-4 w-4 opacity-70" />
                                <span className="truncate">{item}</span>
                            </Button>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}
