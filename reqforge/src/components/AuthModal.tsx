"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // We need to create this or perform a check
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs" // We need to create this or perform a check
import { Label } from "@/components/ui/label" // We need to create this or perform a check
import { Lock, User, ArrowRight, Loader2 } from "lucide-react"

interface AuthModalProps {
    onLoginSuccess: (token: string, username: string) => void
}

export default function AuthModal({ onLoginSuccess }: AuthModalProps) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    // Login State
    const [loginUser, setLoginUser] = useState("")
    const [loginPass, setLoginPass] = useState("")

    // Register State
    const [regUser, setRegUser] = useState("")
    const [regPass, setRegPass] = useState("")
    const [regSuccess, setRegSuccess] = useState(false)

    const BACKEND_URL = "http://localhost:8000"

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch(`${BACKEND_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loginUser, password: loginPass }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Login failed")
            }

            onLoginSuccess(data.access_token, loginUser)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setRegSuccess(false)

        try {
            const res = await fetch(`${BACKEND_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: regUser, password: regPass }),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.detail || "Registration failed")
            }

            setRegSuccess(true)
            // Optional: Auto-login or ask user to switch tab
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-4"
            >
                <Card className="border-[#08CB00]/30 bg-black shadow-[0_0_40px_rgba(8,203,0,0.15)]">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold tracking-widest text-[#08CB00]">
                            ACCESS CONTROL
                        </CardTitle>
                        <CardDescription className="text-xs text-gray-500 font-mono">
                            AUTHENTICATE TO CONNECT TO NEURAL CORE
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="login" className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-black/50 border border-[#08CB00]/20 mb-6">
                                <TabsTrigger
                                    value="login"
                                    className="data-[state=active]:bg-[#08CB00]/20 data-[state=active]:text-[#08CB00] text-gray-500"
                                >
                                    LOGIN
                                </TabsTrigger>
                                <TabsTrigger
                                    value="register"
                                    className="data-[state=active]:bg-[#08CB00]/20 data-[state=active]:text-[#08CB00] text-gray-500"
                                >
                                    REGISTER
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="login">
                                <form onSubmit={handleLogin} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="username" className="text-xs font-mono text-gray-400">AGENT_ID (USERNAME)</Label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="username"
                                                placeholder="agent_01"
                                                value={loginUser}
                                                onChange={(e) => setLoginUser(e.target.value)}
                                                className="pl-9 bg-[#050505] border-[#08CB00]/20 text-[#08CB00] focus-visible:ring-[#08CB00]/50"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-xs font-mono text-gray-400">ACCESS_KEY (PASSWORD)</Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="••••••••"
                                                value={loginPass}
                                                onChange={(e) => setLoginPass(e.target.value)}
                                                className="pl-9 bg-[#050505] border-[#08CB00]/20 text-[#08CB00] focus-visible:ring-[#08CB00]/50"
                                            />
                                        </div>
                                    </div>

                                    {error && <p className="text-xs text-red-500 font-mono bg-red-950/20 p-2 border border-red-900/50 rounded">{error}</p>}

                                    <Button type="submit" disabled={loading} className="w-full bg-[#08CB00] text-black font-bold hover:bg-[#08CB00]/90 shadow-[0_0_15px_rgba(8,203,0,0.4)]">
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                        INITIATE SESSION
                                    </Button>
                                </form>
                            </TabsContent>

                            <TabsContent value="register">
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="r-username" className="text-xs font-mono text-gray-400">NEW_AGENT_ID</Label>
                                        <Input
                                            id="r-username"
                                            value={regUser}
                                            onChange={(e) => setRegUser(e.target.value)}
                                            className="bg-[#050505] border-[#08CB00]/20 text-[#08CB00]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="r-password" className="text-xs font-mono text-gray-400">SET_ACCESS_KEY</Label>
                                        <Input
                                            id="r-password"
                                            type="password"
                                            value={regPass}
                                            onChange={(e) => setRegPass(e.target.value)}
                                            className="bg-[#050505] border-[#08CB00]/20 text-[#08CB00]"
                                        />
                                    </div>

                                    {regSuccess && <p className="text-xs text-[#08CB00] font-mono bg-[#08CB00]/10 p-2 border border-[#08CB00]/30 rounded">Registration successful. Please switch to Login tab.</p>}
                                    {error && <p className="text-xs text-red-500 font-mono bg-red-950/20 p-2 border border-red-900/50 rounded">{error}</p>}

                                    <Button type="submit" disabled={loading} variant="outline" className="w-full border-[#08CB00]/50 text-[#08CB00] hover:bg-[#08CB00]/10">
                                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "CREATE RECORD"}
                                    </Button>
                                </form>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-center border-t border-white/5 pt-4">
                        <p className="text-[10px] text-gray-600 font-mono">SECURE CONNECTION • ENCRYPTED</p>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    )
}
