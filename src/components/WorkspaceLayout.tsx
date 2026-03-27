import * as React from "react"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card } from "@/components/ui/card"
import {
  User,
  Settings,
  LogOut,
  Bell,
  Sun,
  MessageSquare,
  LayoutDashboard
} from "lucide-react"

/**
 * Custom hook for media queries
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false)

  React.useEffect(() => {
    const media = window.matchMedia(query)
    const listener = () => setMatches(media.matches)
    listener() // Check on mount
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}

export default function WorkspaceLayout() {
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* Header */}
      <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6 shrink-0">
        <div className="flex items-center gap-2 font-semibold">
          <LayoutDashboard className="h-6 w-6" />
          <span>NexusWorkspace</span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Sun className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Separator orientation="vertical" className="h-6 mx-1" />

          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden">
        {isMobile ? (
          /* Mobile View: Tabs */
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <div className="px-4 py-2 border-b bg-background">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="workspace">Workspace</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="chat" className="flex-1 m-0 p-4">
              <Card className="h-full flex items-center justify-center border-dashed">
                <div className="text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground font-medium">Chat Interface Placeholder</p>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="workspace" className="flex-1 m-0 p-4">
              <Card className="h-full flex items-center justify-center border-dashed">
                <div className="text-center">
                  <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p className="text-muted-foreground font-medium">Workspace Viewer Placeholder</p>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        ) : (
          /* Desktop View: Resizable Panels */
          <ResizablePanelGroup  className="h-full">
            <ResizablePanel defaultSize={35} minSize={25} maxSize={50}>
              <div className="h-full p-6">
                <Card className="h-full flex items-center justify-center border-dashed bg-card/50">
                  <div className="text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-semibold">Assistant Chat</h3>
                    <p className="text-sm text-muted-foreground">Placeholder for assistant-ui interface</p>
                  </div>
                </Card>
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={65}>
              <div className="h-full p-6 bg-muted/20">
                <Card className="h-full flex items-center justify-center border-dashed bg-card/50">
                  <div className="text-center">
                    <LayoutDashboard className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-semibold">Document Viewer</h3>
                    <p className="text-sm text-muted-foreground">Placeholder for dynamic React Island viewer</p>
                  </div>
                </Card>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        )}
      </main>
    </div>
  )
}
