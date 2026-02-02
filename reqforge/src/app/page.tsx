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
    }, 3600) // 3.6s to match the loading bar animation slightly

    return () => clearTimeout(timer)
  }, [])

  const handleGenerate = (req: string) => {
    setLoading(true)
    setOutputData(null)

    // Simulate smart loading steps
    // In a real app, this would be streaming or multiple states
    setTimeout(() => {
      setLoading(false)
      setOutputData({
        stories: true,
        apis: true,
        edgeCases: true
      })
    }, 2500)
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
