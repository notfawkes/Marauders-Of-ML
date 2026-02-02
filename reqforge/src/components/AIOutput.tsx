"use client"
import React from 'react';

import { Button } from "@/components/ui/button"
import { Terminal, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface AIOutputProps {
    loading: boolean
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
}

export function AIOutput({ loading, data }: AIOutputProps) {
    const content = data?.response || (typeof data === 'string' ? data : JSON.stringify(data, null, 2) || "")

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
                ) : !content ? (
                    <div className="h-20 flex items-center text-gray-500/50">
                        <p className="font-mono">{`// Ready for input. Awaiting requirements...`}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="pl-4 text-gray-300 font-mono text-xs prose prose-invert max-w-none">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '')
                                        return !inline && match ? (
                                            <div className="relative my-4 rounded border border-[#08CB00]/30 bg-[#050505]">
                                                <div className="flex items-center justify-between border-b border-[#08CB00]/30 bg-[#08CB00]/10 px-3 py-1">
                                                    <span className="text-[10px] lowercase text-[#08CB00]">{match[1]}</span>
                                                </div>
                                                <div className="overflow-x-auto p-3">
                                                    <code className={className} {...props}>
                                                        {children}
                                                    </code>
                                                </div>
                                            </div>
                                        ) : (
                                            <code className="bg-[#08CB00]/10 text-[#08CB00] px-1 py-0.5 rounded" {...props}>
                                                {children}
                                            </code>
                                        )
                                    },
                                    ul: ({ children }) => <ul className="list-disc pl-4 space-y-1 my-2 text-gray-300">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-4 space-y-1 my-2 text-gray-300">{children}</ol>,
                                    h1: ({ children }) => (
                                        <div className="flex items-center gap-2 text-[#08CB00] mt-6 mb-3 border-b border-[#08CB00]/20 pb-1">
                                            <div className="h-2 w-2 bg-[#08CB00]" />
                                            <h1 className="text-lg font-bold tracking-wider uppercase">{children}</h1>
                                        </div>
                                    ),
                                    h2: ({ children }) => (
                                        <div className="flex items-center gap-2 text-[#08CB00] mt-5 mb-2">
                                            <span className="text-[#08CB00]/50">#</span>
                                            <h2 className="text-base font-bold uppercase">{children}</h2>
                                        </div>
                                    ),
                                    h3: ({ children }) => (
                                        <h3 className="text-sm font-bold text-[#08CB00] mt-4 mb-1 pl-4 border-l-2 border-[#08CB00]/30">{children}</h3>
                                    ),
                                    p: ({ children }) => {
                                        // Simple regex checks for log levels in text
                                        // This is a naive implementation; ReactMarkdown passes children as nodes.
                                        // We'll trust standard rendering for now, but style the P tag.
                                        return <p className="mb-2 leading-relaxed ml-1">{children}</p>
                                    },
                                    li: ({ children }) => {
                                        // Custom rendering for list items to highlight specific keywords
                                        const content = React.Children.toArray(children).map((child) => {
                                            if (typeof child === 'string') {
                                                if (child.includes('[CRITICAL]')) {
                                                    return <span key={child} className="text-red-500 font-bold glow-red">{child}</span>
                                                }
                                                if (child.includes('[WARN]')) {
                                                    return <span key={child} className="text-yellow-500 font-bold">{child}</span>
                                                }
                                                if (child.includes('[INFO]')) {
                                                    return <span key={child} className="text-blue-400 font-bold">{child}</span>
                                                }
                                                // Handle API Methods if they appear at start of line
                                                if (child.trim().startsWith('POST ')) return <><span className="text-green-500 font-bold">POST</span>{child.substring(4)}</>
                                                if (child.trim().startsWith('GET ')) return <><span className="text-blue-400 font-bold">GET</span>{child.substring(3)}</>
                                                if (child.trim().startsWith('DELETE ')) return <><span className="text-red-500 font-bold">DELETE</span>{child.substring(6)}</>
                                                if (child.trim().startsWith('PUT ')) return <><span className="text-yellow-500 font-bold">PUT</span>{child.substring(3)}</>
                                            }
                                            return child
                                        })
                                        return <li className="mb-1">{content}</li>
                                    },
                                    a: ({ href, children }) => <a href={href} className="text-[#08CB00] underline decoration-[#08CB00]/50 hover:decoration-[#08CB00] transition-colors">{children}</a>,
                                    blockquote: ({ children }) => <blockquote className="border-l-2 border-yellow-500/50 pl-4 italic text-yellow-500/80 my-4 bg-yellow-500/5 p-2 rounded-r">{children}</blockquote>,
                                }}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>

                        <div className="pt-4 text-[#08CB00] border-t border-[#08CB00]/10 mt-4 flex items-center justify-between opacity-50">
                            <span>&gt; END_OF_TRANSMISSION</span>
                            <span className="animate-pulse">_</span>
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}
