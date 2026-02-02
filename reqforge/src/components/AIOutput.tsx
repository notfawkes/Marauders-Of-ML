"use client"

import { Button } from "@/components/ui/button"
import { Check, Code, AlertTriangle, Terminal, XCircle, Copy } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface AIOutputProps {
    loading: boolean
    data: any
}

export function AIOutput({ loading, data }: AIOutputProps) {
    return (
        <div className="flex h-full flex-col bg-[#0a0a0a] text-xs font-mono">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-border/40 bg-muted/20 px-4 py-2">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 border-b-2 border-primary px-1 pb-2 -mb-2.5 text-foreground">
                        <Terminal className="h-3 w-3" />
                        <span className="font-semibold">OUTPUT</span>
                    </div>
                    <div className="px-1 text-muted-foreground pb-2 cursor-pointer hover:text-foreground">DEBUG CONSOLE</div>
                    <div className="px-1 text-muted-foreground pb-2 cursor-pointer hover:text-foreground">PROBLEMS</div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground">
                        <XCircle className="h-3 w-3" />
                    </Button>
                </div>
            </div>

            {/* Terminal Body */}
            <ScrollArea className="flex-1 p-4">
                {loading ? (
                    <div className="space-y-1 text-muted-foreground animate-pulse">
                        <p>Running translation task...</p>
                        <p> Analyzing requirements...</p>
                        <p> &gt; Parsing user intent...</p>
                    </div>
                ) : !data ? (
                    <div className="h-20 flex items-center text-muted-foreground/50">
                        <p>Run a translation to see engineering specs here...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Section: User Stories */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-green-400 font-bold border-b border-white/10 pb-1 mb-2">
                                <Check className="h-3 w-3" />
                                <span>USER STORIES GENERATED</span>
                            </div>
                            <ul className="space-y-1 pl-4 text-muted-foreground">
                                <li>[frontend] As a user, I want to authenticate via OTP so I can access the system securely.</li>
                                <li>[frontend] As a user, I want to reset my password using a verified email link.</li>
                                <li>[backend] As a system, I want to issue JWT tokens upon successful login.</li>
                            </ul>
                        </div>

                        {/* Section: APIs */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-400 font-bold border-b border-white/10 pb-1 mb-2">
                                <Code className="h-3 w-3" />
                                <span>API ENDPOINTS DETECTED</span>
                            </div>
                            <div className="space-y-1 pl-4">
                                <div className="flex gap-2"><span className="text-yellow-500 w-12">POST</span> <span>/auth/login-otp</span></div>
                                <div className="flex gap-2"><span className="text-yellow-500 w-12">POST</span> <span>/auth/verify-otp</span></div>
                                <div className="flex gap-2"><span className="text-green-500 w-12">GET</span> <span>/user/profile</span></div>
                            </div>
                        </div>

                        {/* Section: Edge Cases */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-500 font-bold border-b border-white/10 pb-1 mb-2">
                                <AlertTriangle className="h-3 w-3" />
                                <span>EDGE CASES & RISKS</span>
                            </div>
                            <ul className="space-y-1 pl-4 text-red-300/80">
                                <li>[risk - high] OTP expiration or replay attacks.</li>
                                <li>[risk - med] Token revocation on password reset not handled.</li>
                                <li>[perf] Rate limiting missing on auth endpoints.</li>
                            </ul>
                        </div>

                        <div className="pt-4 text-green-500">
                            &gt; Translation complete. 3 stories, 3 endpoints, 3 risks identified.
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
