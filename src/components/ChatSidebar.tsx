import * as React from "react"
// import {
//   Thread,
//   ThreadList,
//   useEdgeRuntime
// } from "@assistant-ui/react"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  History,
  PlusCircle,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react"

/**
 * ChatSidebar Component
 * Integrates @assistant-ui/react with shadcn/ui components.
 * Uses a Sheet for a collapsible ThreadList (History).
 */
export default function ChatSidebar() {
  // Assuming useEdgeRuntime is the configured runtime hook
  // const runtime = useEdgeRuntime({
  //   api: "/api/chat",
  // })

  return (
    <div className="flex flex-col h-full w-full bg-card border-r overflow-hidden">
      {/* Sidebar Header / Controls */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Sheet>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <SheetTrigger>
                    <Button variant="ghost" size="icon">
                      <History className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>View Chat History</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Chat History
                </SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-65px)]">
                {/* assistant-ui ThreadList component */}
                <div className="p-4 text-center text-muted-foreground">ThreadList Placeholder</div>
              </ScrollArea>
            </SheetContent>
          </Sheet>

          <h2 className="font-semibold text-sm tracking-tight uppercase text-muted-foreground">
            Assistant
          </h2>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                size="icon"
              >
                <PlusCircle className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Start a New Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main Chat Area - assistant-ui Thread component */}
      <div className="flex-1 overflow-hidden relative">
        <div className="h-full w-full p-4 flex items-center justify-center text-muted-foreground">Thread Placeholder</div>
      </div>
    </div>
  )
}
