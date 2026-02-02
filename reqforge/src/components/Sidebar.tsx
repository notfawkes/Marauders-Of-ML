import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, MessageSquare } from "lucide-react"

export function Sidebar() {
    return (
        <div className="flex h-full w-[260px] flex-col border-r bg-background/50 backdrop-blur-xl">
            <div className="p-4">
                <div className="mb-6 flex items-center gap-2 px-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <div className="h-4 w-4 rounded-sm bg-primary" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold tracking-tight">ReqForge</h1>
                        <p className="text-[10px] text-muted-foreground">AI Requirement Translator</p>
                    </div>
                </div>
                <Button className="w-full justify-start gap-2" variant="outline">
                    <Plus className="h-4 w-4" />
                    New Translation
                </Button>
            </div>
            <ScrollArea className="flex-1 px-2">
                <div className="space-y-1 p-2">
                    <p className="px-2 text-xs font-medium text-muted-foreground mb-2">Recent</p>
                    {["Payment Authentication Flow", "User Profile Dashboard", "Email Notification System", "Subscription Upgrade Path", "Mobile API Gateway"].map((item, i) => (
                        <Button
                            key={i}
                            variant="ghost"
                            className="w-full justify-start gap-2 h-9 px-2 text-sm font-normal text-muted-foreground hover:text-foreground"
                        >
                            <MessageSquare className="h-4 w-4 opacity-50" />
                            <span className="truncate">{item}</span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
