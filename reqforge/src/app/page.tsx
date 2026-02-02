"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { RequirementInput } from "@/components/RequirementInput"
import { AIOutput } from "@/components/AIOutput"
import LoadingScreen from "@/components/LoadingScreen"
import AuthModal from "@/components/AuthModal"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [outputData, setOutputData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)

  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(null)

  useEffect(() => {
    // Initial cinematic loading delay
    const timer = setTimeout(() => {
      setIsAppLoading(false)
    }, 3600) // 3.6s to match the loading bar animation slightly

    return () => clearTimeout(timer)
  }, [])

  const handleLoginSuccess = (token: string, username: string) => {
    setAuthToken(token)
    // username is not currently used in this component, but available if needed
    console.log("Logged in as:", username)
  }

  const handleGenerate = async (req: string) => {
    if (!authToken) return

    setLoading(true)
    setOutputData(null)

    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({ message: req })
      })

      if (!res.ok) throw new Error("Failed to generate")

      const data = await res.json()
      setOutputData(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      setOutputData({ response: `Error generating response: ${error.message || "Unknown error"}` })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="loading-screen"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      {!isAppLoading && !authToken && (
        <AuthModal onLoginSuccess={handleLoginSuccess} />
      )}

      {authToken && (
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans antialiased">
          <Sidebar authToken={authToken} />
          <main className="flex flex-1 flex-col overflow-hidden">
            <div className="flex-1 overflow-hidden border-b bg-background">
              <RequirementInput onGenerate={handleGenerate} isGenerating={loading} />
            </div>
            <div className="h-[45%] min-h-[200px] overflow-hidden bg-[#0a0a0a]">
              <AIOutput loading={loading} data={outputData} />
            </div>
          </main>
        </div>
      )}
    </>
  )
}
