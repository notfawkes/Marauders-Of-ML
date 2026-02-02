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
                        <p className="font-mono">// Ready for input. Awaiting requirements...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Section: User Stories */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#08CB00] font-bold border-b border-[#08CB00]/20 pb-1 mb-2">
                                <Check className="h-3 w-3" />
                                <span>USER_STORIES.JSON</span>
                            </div>
                            <ul className="space-y-1 pl-4 text-gray-300">
                                <li><span className="text-gray-600">01.</span> As a user, I want to authenticate via OTP so I can access the system securely.</li>
                                <li><span className="text-gray-600">02.</span> As a user, I want to reset my password using a verified email link.</li>
                                <li><span className="text-gray-600">03.</span> As a system, I want to issue JWT tokens upon successful login.</li>
                            </ul>
                        </div>

                        {/* Section: APIs */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-[#08CB00] font-bold border-b border-[#08CB00]/20 pb-1 mb-2">
                                <Code className="h-3 w-3" />
                                <span>API_ENDPOINTS.YAML</span>
                            </div>
                            <div className="space-y-1 pl-4">
                                <div className="flex gap-2"><span className="text-[#08CB00] font-bold w-12">POST</span> <span className="text-gray-300">/auth/login-otp</span></div>
                                <div className="flex gap-2"><span className="text-[#08CB00] font-bold w-12">POST</span> <span className="text-gray-300">/auth/verify-otp</span></div>
                                <div className="flex gap-2"><span className="text-cyan-500 font-bold w-12">GET</span> <span className="text-gray-300">/user/profile</span></div>
                            </div>
                        </div>

                        {/* Section: Edge Cases */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-500 font-bold border-b border-amber-500/20 pb-1 mb-2">
                                <AlertTriangle className="h-3 w-3" />
                                <span>EDGE_CASES.MD</span>
                            </div>
                            <ul className="space-y-1 pl-4 text-amber-200/80">
                                <li>[WARN] OTP expiration or replay attacks.</li>
                                <li>[WARN] Token revocation on password reset not handled.</li>
                                <li>[PERF] Rate limiting missing on auth endpoints.</li>
                            </ul>
                        </div>

                        <div className="pt-4 text-[#08CB00] border-t border-[#08CB00]/10 mt-4">
                            &gt; Process completed successfully. Artifacts generated.
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
