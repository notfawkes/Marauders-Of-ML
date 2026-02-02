"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, Code, AlertTriangle, Copy, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface AIOutputProps {
    loading: boolean
    data: any
}

export function AIOutput({ loading, data }: AIOutputProps) {
    if (loading) {
        return (
            <div className="flex h-full w-full flex-col items-center justify-center space-y-4 p-8 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <div className="space-y-1 text-center text-sm">
                    <p>Parsing requirement...</p>
                    <p className="opacity-50">Identifying actors...</p>
                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex h-full w-full items-center justify-center p-8 text-muted-foreground/50">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-12 w-12 rounded-full border-2 border-dashed flex items-center justify-center">
                        <Code className="h-6 w-6" />
                    </div>
                    <p>Output will appear here</p>
                </div>
            </div>
        )
    }

    return (
        <div className="h-full w-full overflow-y-auto border-l bg-muted/10 p-6">
            <div className="space-y-6">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Check className="h-4 w-4 text-green-500" />
                                User Stories
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2"><span className="text-green-500">•</span> As a user, I want to authenticate via OTP so I can access the system securely.</li>
                                <li className="flex gap-2"><span className="text-green-500">•</span> As a user, I want to reset my password using a verified email link.</li>
                                <li className="flex gap-2"><span className="text-green-500">•</span> As a system, I want to issue JWT tokens upon successful login.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <Code className="h-4 w-4 text-blue-500" />
                                API Specifications
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-muted/50 p-2 rounded-md font-mono text-xs space-y-2">
                                <div className="flex justify-between"><span className="text-blue-400">POST</span> /auth/login-otp</div>
                                <div className="flex justify-between"><span className="text-blue-400">POST</span> /auth/verify-otp</div>
                                <div className="flex justify-between"><span className="text-green-400">GET</span> /user/profile</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                                Edge Cases
                            </CardTitle>
                            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3" /></Button>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2 text-sm text-muted-foreground">
                                <li className="flex gap-2"><span className="text-amber-500">⚠</span> OTP expiration or replay attacks.</li>
                                <li className="flex gap-2"><span className="text-amber-500">⚠</span> Token revocation on password reset.</li>
                                <li className="flex gap-2"><span className="text-amber-500">⚠</span> Rate limiting on auth endpoints.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}
