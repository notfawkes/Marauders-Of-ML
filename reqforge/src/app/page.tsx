"use client"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/Sidebar"
import { RequirementInput } from "@/components/RequirementInput"
import { AIOutput } from "@/components/AIOutput"
import LoadingScreen from "@/components/LoadingScreen"
import { AnimatePresence, motion } from "framer-motion"

export default function Home() {
  const [outputData, setOutputData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)

  useEffect(() => {
    // Initial cinematic loading delay
    const timer = setTimeout(() => {
      setIsAppLoading(false)
    }, 3600)

    return () => clearTimeout(timer)
  }, [])

  const handleGenerate = async (req: string) => {
    setLoading(true)
    setOutputData(null)

    try {
      // Public Bearer Token (Valid for 1 year)
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCYWxhIiwiZXhwIjoxODAxNTY0MTY0fQ.xr0-VQ5E9aNH9_qSWjegoFXFLNROV99s_opGXfNVYjA"

      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ message: req })
      })

      if (!res.ok) throw new Error("API Failed")

      const data = await res.json()
      // Parse the inner JSON string from the LLM
      const parsedAI = JSON.parse(data.response)

      setOutputData(parsedAI)
    } catch (e) {
      console.error(e)
      setOutputData({
        stories: ["Error connecting to backend"],
        apis: [],
        edge_cases: []
      })
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

      <div className="flex h-screen w-full overflow-hidden bg-background text-foreground font-sans antialiased">
        <Sidebar />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden border-b bg-background">
            <RequirementInput onGenerate={handleGenerate} isGenerating={loading} />
          </div>
          <div className="h-[45%] min-h-[200px] overflow-hidden bg-[#0a0a0a]">
            <AIOutput loading={loading} data={outputData} />
          </div>
        </main>
      </div>
    </>
  )
}
