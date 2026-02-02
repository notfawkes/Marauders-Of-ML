"use client"

import { Button } from "@/components/ui/button"
import { Code, Terminal, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIOutputProps {
    loading: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
}

export function AIOutput({ loading, data }: AIOutputProps) {
    return (
        <div className="flex h-full flex-col bg-black text-xs font-mono border-t border-[#08CB00]/20">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-[#08CB00]/20 bg-black px-4 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border-b-2 border-[#08CB00] px-1 pb-2 -mb-2.5 text-[#08CB00] shadow-[0_4px_10px_-4px_#08CB00]">
                        <Terminal className="h-3 w-3" />
                        <span className="font-semibold tracking-wide">SYSTEM_OUTPUT</span>
                    </div>

                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-gray-600 hover:text-[#08CB00]">
                        <XCircle className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Terminal Body */}
            <ScrollArea className="flex-1 p-4 bg-black">
                {loading ? (
                    <div className="space-y-1 text-[#08CB00] animate-pulse">
                        <p>&gt; Initializing DevBridge AI core...</p>
                        <p>&gt; Analyzing requirements graph...</p>
                        <p>&gt; Generating architecture specs...</p>
                    </div>
                ) : !data ? (
                    <div className="h-20 flex items-center text-gray-500/50">
                        <p className="font-mono">{`// Ready for input. Awaiting requirements...`}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#08CB00] font-bold border-b border-[#08CB00]/20 pb-1 mb-2">
                                <Code className="h-3 w-3" />
                                <span>RESPONSE.MD</span>
                            </div>
                            <div className="pl-4 text-gray-300 whitespace-pre-wrap font-mono text-xs">
                                {data?.response || JSON.stringify(data, null, 2)}
                            </div>
                        </div >

                        <div className="pt-4 text-[#08CB00] border-t border-[#08CB00]/10 mt-4">
                            &gt; Process completed successfully. Response received.
                        </div>
                    </div >
                )
                }
            </ScrollArea >
        </div >
    )
}
