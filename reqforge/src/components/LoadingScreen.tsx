"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import NeuralBackground from "@/components/NeuralBackground"

const loadingMessages = [
    "Initializing System...",
    "Loading DevBridge Core...",
    "Connecting to Neural Network...",
    "System Ready."
]

export default function LoadingScreen() {
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentMessageIndex((prev) => (prev + 1) % loadingMessages.length)
        }, 800) // Change message every 800ms

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            {/* Background Layer */}
            <div className="absolute inset-0 z-0">
                <NeuralBackground
                    color="#08CB00"
                    speed={1.5} // Faster speed for loading effect
                    particleCount={800}
                    trailOpacity={0.3}
                />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content Layer - Glass Box */}
            <div className="relative z-10 flex flex-col items-center justify-center rounded-xl border border-[#08CB00]/30 bg-black/40 p-12 backdrop-blur-md shadow-[0_0_50px_rgba(8,203,0,0.2)]">

                {/* Animated Text */}
                <h2 className="mb-2 text-2xl font-bold tracking-widest text-[#08CB00] drop-shadow-[0_0_10px_rgba(8,203,0,0.8)]">
                    DEVBRIDGE
                </h2>

                <div className="h-6 overflow-hidden">
                    <motion.p
                        key={currentMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="text-xs font-mono text-gray-300"
                    >
                        &gt; {loadingMessages[currentMessageIndex]}
                    </motion.p>
                </div>

                {/* Loading Bar */}
                <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-[#08CB00]/20">
                    <motion.div
                        className="h-full bg-[#08CB00] shadow-[0_0_10px_#08CB00]"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3.5, ease: "linear" }}
                    />
                </div>
            </div>
        </div>
    )
}
