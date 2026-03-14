import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Send, 
  Plus, 
  MoreVertical, 
  FileText, 
  Table as TableIcon, 
  Code, 
  Mail, 
  Share2, 
  ExternalLink, 
  Download, 
  Play, 
  Save, 
  Trash2, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Database, 
  Loader2, 
  User, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageSquare,
  History,
  Info,
  Check,
  X,
  CornerDownRight
} from 'lucide-react';

/** * SHADCN UI COMPONENTS (MOCK IMPLEMENTATIONS)
 * Following the "No Tailwind Slop" rule by providing composable components.
 */

const Button = React.forwardRef(({ className = "", variant = "default", size = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };
  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
});

const Card = ({ className, ...props }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`} {...props} />
);
const CardHeader = ({ className, ...props }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`} {...props} />
);
const CardTitle = ({ className, ...props }) => (
  <h3 className={`font-semibold leading-none tracking-tight text-xl ${className}`} {...props} />
);
const CardDescription = ({ className, ...props }) => (
  <p className={`text-sm text-muted-foreground ${className}`} {...props} />
);
const CardContent = ({ className, ...props }) => (
  <div className={`p-6 pt-0 ${className}`} {...props} />
);
const CardFooter = ({ className, ...props }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`} {...props} />
);

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
    success: "border-transparent bg-emerald-500/15 text-emerald-500 hover:bg-emerald-500/20",
  };
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`} {...props} />
  );
};

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
  <input
    type={type}
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    ref={ref}
    {...props}
  />
));

const Progress = ({ value, className, ...props }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-secondary ${className}`} {...props}>
    <div
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </div>
);

const Separator = ({ className, orientation = "horizontal", ...props }) => (
  <div
    className={`shrink-0 bg-border ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`}
    {...props}
  />
);

const ScrollArea = ({ children, className }) => (
  <div className={`relative overflow-auto ${className}`}>
    {children}
  </div>
);

/**
 * WORKSPACE COMPONENTS
 */

const ChatSidebar = ({ isMobile }) => {
  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-blue-500" />
          Assistant
        </h2>
        <Button variant="ghost" size="icon" title="New Chat">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Today</p>
            <div className="space-y-1">
              {['Refactoring Health Module', 'API Documentation Draft', 'Deploying to Cloudflare'].map((chat, i) => (
                <div key={i} className={`p-2 text-sm rounded-md cursor-pointer flex items-center gap-2 ${i === 0 ? 'bg-accent' : 'hover:bg-accent/50'}`}>
                  <History className="w-3.5 h-3.5 opacity-50" />
                  <span className="truncate">{chat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t space-y-2">
        <div className="flex gap-2">
          <Input placeholder="Message Assistant..." className="bg-muted/50" />
          <Button size="icon" className="shrink-0">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground">
          Stitch AI Agent v2.4.0
        </p>
      </div>
    </div>
  );
};

/**
 * COMMENT COMPONENT (SHADCN PATTERN)
 */
const CommentThread = ({ author, time, content, isAgent, rationale, onAccept, onDiscard }) => (
  <Card className={`mb-4 border-l-4 ${isAgent ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-muted'}`}>
    <CardHeader className="p-3 pb-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white ${isAgent ? 'bg-blue-600' : 'bg-slate-500'}`}>
            {isAgent ? <Activity className="w-3 h-3" /> : author.charAt(0)}
          </div>
          <span className="text-xs font-semibold">{isAgent ? '@agent' : author}</span>
        </div>
        <span className="text-[10px] text-muted-foreground">{time}</span>
      </div>
    </CardHeader>
    <CardContent className="p-3 pt-2 text-xs leading-relaxed">
      {content}
      {rationale && (
        <div className="mt-2 p-2 bg-muted/50 rounded border text-[11px] italic text-muted-foreground flex gap-2">
          <Info className="w-3 h-3 shrink-0 mt-0.5" />
          <span>{rationale}</span>
        </div>
      )}
    </CardContent>
    {isAgent && (
      <CardFooter className="p-2 pt-0 flex justify-end gap-2">
        <Button variant="ghost" size="sm" className="h-7 text-[10px] px-2" onClick={onDiscard}><X className="w-3 h-3 mr-1" /> Discard</Button>
        <Button variant="secondary" size="sm" className="h-7 text-[10px] px-2" onClick={onAccept}><Check className="w-3 h-3 mr-1" /> Accept</Button>
      </CardFooter>
    )}
  </Card>
);

const WorkspaceViewer = ({ type, data }) => {
  const [activeTab, setActiveTab] = useState('main');

  const Viewers = {
    doc: () => (
      <Card className="h-full flex flex-col border-none shadow-none rounded-none bg-muted/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 border-b bg-background">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-500" />
            <div>
              <CardTitle className="text-sm font-medium">Q3 Strategy Overview</CardTitle>
              <p className="text-xs text-muted-foreground">Updated 2m ago by Stitch</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">Live Syncing</Badge>
            <Button variant="outline" size="sm">Share</Button>
            <Button size="sm">Open in Docs</Button>
          </div>
        </CardHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Main Doc Content */}
          <ScrollArea className="flex-1 bg-muted/20">
            <div className="max-w-4xl mx-auto my-8 bg-white shadow-lg p-12 min-h-[1100px] text-slate-800 relative">
               <h1 className="text-4xl font-bold mb-8">Project Antigravity</h1>
               
               <p className="mb-4 text-lg">
                 This document outlines the 
                 <span className="bg-red-100 text-red-600 line-through decoration-red-600/50 mx-1">migration of our legacy systems</span>
                 <span className="bg-emerald-100 text-emerald-700 px-1 rounded border-b-2 border-emerald-500 mx-1">seamless transition of our core infrastructure</span>
                 to the Cloudflare ecosystem.
               </p>

               <div className="h-4 w-2/3 bg-slate-100 rounded mb-2"></div>
               <div className="h-4 w-full bg-slate-100 rounded mb-2"></div>
               <div className="h-4 w-5/6 bg-slate-100 rounded mb-10"></div>
               
               <h2 className="text-2xl font-semibold mb-4 border-b pb-2">System Requirements</h2>
               <ul className="list-disc pl-5 space-y-4">
                 <li>
                   <span className="bg-blue-50 border-b border-blue-400">Zero-trust architecture integration</span>
                   <p className="text-sm text-slate-500 mt-1 italic">Note: Ensure we use the latest WARP clients for all edge nodes.</p>
                 </li>
                 <li>D1 Database for persistent state</li>
                 <li>Hono-based routing</li>
               </ul>

               {/* Mock Indicator of Agent working */}
               <div className="absolute right-[-20px] top-[120px] w-1 bg-blue-500 h-10 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
          </ScrollArea>

          {/* Comments Sidebar */}
          <aside className="w-[320px] border-l bg-background p-4 overflow-y-auto hidden lg:block">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Comments & Suggestions</h3>
              <Badge variant="secondary" className="text-[10px]">3 Active</Badge>
            </div>

            {/* User Request */}
            <CommentThread 
              author="JD" 
              time="12:44 PM" 
              content={<span><span className="text-blue-500 font-medium">@agent</span> please improve this sentence .. make it more formal</span>}
            />

            {/* Agent Suggestion */}
            <CommentThread 
              isAgent={true}
              time="12:45 PM" 
              content={
                <div className="space-y-2">
                  <p>Suggested Edit:</p>
                  <div className="p-2 border rounded bg-background">
                    <span className="line-through opacity-50">migration of our legacy systems</span>
                    <ChevronRight className="w-3 h-3 inline mx-1" />
                    <span className="text-emerald-500 font-medium">seamless transition of our core infrastructure</span>
                  </div>
                </div>
              }
              rationale="I replaced 'migration' with 'seamless transition' to convey a lower risk profile and 'legacy systems' with 'core infrastructure' to highlight the strategic importance of the assets being moved. This aligns with Executive Summary standards."
              onAccept={() => console.log('Accepted')}
              onDiscard={() => console.log('Discarded')}
            />

            <CommentThread 
              author="System" 
              time="1:05 PM" 
              content="Automatic conflict detection: No issues found with the proposed D1 schema updates."
            />
          </aside>
        </div>
      </Card>
    ),
    sheet: () => (
      <Card className="h-full flex flex-col border-none shadow-none rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 border-b">
          <div className="flex items-center gap-3">
            <TableIcon className="w-5 h-5 text-emerald-500" />
            <CardTitle className="text-sm font-medium">Infrastructure Cost Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <select className="bg-background border rounded px-2 py-1 text-xs">
              <option>Summary</option>
              <option>Raw Data</option>
              <option>Projections</option>
            </select>
            <Button variant="outline" size="sm"><Download className="w-3.5 h-3.5 mr-2" /> Export</Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-0 overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-muted z-10">
              <tr>
                <th className="border p-2 text-left w-12 bg-muted/50"></th>
                {['A', 'B', 'C', 'D', 'E'].map(c => <th key={c} className="border p-2 font-medium">{c}</th>)}
              </tr>
            </thead>
            <tbody>
              {[...Array(20)].map((_, i) => (
                <tr key={i}>
                  <td className="border p-2 text-center bg-muted/20 text-xs">{i + 1}</td>
                  <td className="border p-2">{i === 0 ? 'Service' : `Worker-${i}`}</td>
                  <td className="border p-2">{i === 0 ? 'Monthly Cost' : `$${(Math.random() * 100).toFixed(2)}`}</td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                  <td className="border p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    ),
    script: () => (
      <Card className="h-full flex flex-col border-none shadow-none rounded-none bg-[#0d1117]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-yellow-500" />
            <CardTitle className="text-sm font-medium text-slate-200">deploy-worker.js</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white"><Save className="w-3.5 h-3.5 mr-2" /> Save</Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white"><Play className="w-3.5 h-3.5 mr-2" /> Run Test</Button>
          </div>
        </CardHeader>
        <CardContent className="flex-1 p-4 font-mono text-sm overflow-hidden flex flex-col">
           <ScrollArea className="flex-1">
             <pre className="text-emerald-400">
               <code>{`
/**
 * Apps Script: Cloudflare Deployment Trigger
 * Automated by Antigravity IDE
 */

function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('Cloudflare')
      .addItem('Deploy to Production', 'deployToCF')
      .addToUi();
}

async function deployToCF() {
  const response = await UrlFetchApp.fetch('https://api.cloudflare.com/...', {
    method: 'post',
    payload: JSON.stringify({
      id: 'worker-123',
      action: 'deploy'
    })
  });
  
  Logger.log(response.getContentText());
}
               `}</code>
             </pre>
           </ScrollArea>
           <div className="mt-4 p-3 bg-black rounded border border-slate-800 text-xs text-slate-400">
             <div className="flex justify-between mb-2">
               <span>Execution Log</span>
               <span className="text-emerald-500">Ready</span>
             </div>
             <div className="opacity-50">[12:44:01] Initializing runtime...</div>
             <div className="opacity-50">[12:44:02] Authorization successful.</div>
           </div>
        </CardContent>
      </Card>
    ),
    gmail: () => (
      <Card className="h-full flex flex-col border-none shadow-none rounded-none">
        <CardHeader className="py-3 border-b">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Mail className="w-4 h-4 text-red-500" />
            New Draft
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-6 flex flex-col gap-4">
           <div className="space-y-4">
             <div className="flex items-center border-b pb-2">
               <span className="text-sm text-muted-foreground w-12">To</span>
               <Input className="border-none shadow-none focus-visible:ring-0" placeholder="recipients@example.com" />
             </div>
             <div className="flex items-center border-b pb-2">
               <span className="text-sm text-muted-foreground w-12">Subject</span>
               <Input className="border-none shadow-none focus-visible:ring-0" placeholder="System Health Report - March 2026" />
             </div>
           </div>
           <Textarea className="flex-1 border-none shadow-none focus-visible:ring-0 resize-none mt-4 text-base" placeholder="Write your draft here..." defaultValue={`Hi Team,\n\nI've finalized the system health report. You can review the updated dashboard in the Antigravity workspace.\n\nBest regards,\nStitch Agent`} />
           <div className="flex items-center justify-between pt-4 border-t">
              <div className="flex gap-2">
                <Button>Send Draft</Button>
                <Button variant="ghost" size="icon"><Plus className="w-4 h-4" /></Button>
              </div>
              <Button variant="ghost" className="text-destructive"><Trash2 className="w-4 h-4" /></Button>
           </div>
        </CardContent>
      </Card>
    )
  };

  const Viewer = Viewers[type] || Viewers.doc;
  return <Viewer />;
};

const HealthDashboard = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">System Health</h1>
          <p className="text-muted-foreground">Real-time status of Project Antigravity nodes.</p>
        </div>
        <Button onClick={handleScan} disabled={isScanning}>
          {isScanning ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Activity className="w-4 h-4 mr-2" />}
          Run Health Scan
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Global Uptime</CardTitle>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">99.98%</div>
            <Progress value={99.98} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Compute Load</CardTitle>
            <Cpu className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.5%</div>
            <Progress value={24.5} className="mt-4" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">DB Connection</CardTitle>
            <Database className="w-4 h-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12ms</div>
            <p className="text-xs text-muted-foreground mt-4">Latency within threshold</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
          <CardDescription>Automated triggers and deployment logs.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { event: 'D1 Migration', status: 'Success', time: '2 mins ago', color: 'success' },
              { event: 'Edge Runtime Warmup', status: 'Optimal', time: '14 mins ago', color: 'default' },
              { event: 'R2 Sync Latency', status: 'Warning', time: '1 hr ago', color: 'secondary' },
            ].map((ev, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${ev.color === 'success' ? 'bg-emerald-500' : ev.color === 'secondary' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                  <span className="font-medium text-sm">{ev.event}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant={ev.color === 'success' ? 'success' : 'outline'}>{ev.status}</Badge>
                  <span className="text-xs text-muted-foreground">{ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */

export default function App() {
  const [activeView, setActiveView] = useState('workspace'); // 'workspace' | 'health'
  const [docType, setDocType] = useState('doc');
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState('chat');

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground dark">
      {/* GLOBAL HEADER */}
      <header className="h-14 border-b px-4 flex items-center justify-between bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
               <Activity className="w-5 h-5 text-primary-foreground" />
            </div>
            Antigravity
          </div>
          <Separator orientation="vertical" className="h-6" />
          <nav className="flex items-center gap-1">
            <Button 
              variant={activeView === 'workspace' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveView('workspace')}
            >
              Workspace
            </Button>
            <Button 
              variant={activeView === 'health' ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActiveView('health')}
            >
              Health
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input className="pl-9 h-9 bg-muted/50" placeholder="Search workspace..." />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon"><Settings className="w-4 h-4" /></Button>
            <div className="flex items-center gap-2 border rounded-full pl-1 pr-2 py-1 bg-muted/50">
               <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white">JD</div>
               <span className="text-xs font-medium">Codex Eng</span>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-hidden">
        {activeView === 'health' ? (
          <ScrollArea className="h-full">
            <HealthDashboard />
          </ScrollArea>
        ) : (
          <div className="h-full flex flex-col md:flex-row">
            {isMobile ? (
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-hidden">
                  {activeMobileTab === 'chat' ? (
                    <ChatSidebar isMobile={true} />
                  ) : (
                    <WorkspaceViewer type={docType} />
                  )}
                </div>
                {/* Mobile Tabs */}
                <div className="h-16 border-t bg-card flex">
                   <button 
                    onClick={() => setActiveMobileTab('chat')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeMobileTab === 'chat' ? 'text-primary' : 'text-muted-foreground'}`}
                   >
                     <MessageSquare className="w-5 h-5" />
                     <span className="text-[10px] font-medium">Chat</span>
                   </button>
                   <button 
                    onClick={() => setActiveMobileTab('viewer')}
                    className={`flex-1 flex flex-col items-center justify-center gap-1 ${activeMobileTab === 'viewer' ? 'text-primary' : 'text-muted-foreground'}`}
                   >
                     <FileText className="w-5 h-5" />
                     <span className="text-[10px] font-medium">Viewer</span>
                   </button>
                </div>
              </div>
            ) : (
              /* Desktop View (Split Pane Simulation) */
              <div className="flex h-full w-full">
                {/* Left Panel: Chat Interface (35%) */}
                <aside className="w-[350px] shrink-0 border-r">
                   <ChatSidebar isMobile={false} />
                </aside>

                {/* Right Panel: Workspace (65%+) */}
                <section className="flex-1 flex flex-col overflow-hidden bg-muted/5">
                   <div className="p-2 border-b flex items-center gap-2 bg-card/30">
                     <Button 
                      variant={docType === 'doc' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setDocType('doc')}
                     >
                       <FileText className="w-3.5 h-3.5 mr-2" /> Doc
                     </Button>
                     <Button 
                      variant={docType === 'sheet' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setDocType('sheet')}
                     >
                       <TableIcon className="w-3.5 h-3.5 mr-2" /> Sheet
                     </Button>
                     <Button 
                      variant={docType === 'script' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setDocType('script')}
                     >
                       <Code className="w-3.5 h-3.5 mr-2" /> Script
                     </Button>
                     <Button 
                      variant={docType === 'gmail' ? 'secondary' : 'ghost'} 
                      size="sm" 
                      onClick={() => setDocType('gmail')}
                     >
                       <Mail className="w-3.5 h-3.5 mr-2" /> Gmail
                     </Button>
                   </div>
                   <div className="flex-1 overflow-hidden">
                     <WorkspaceViewer type={docType} />
                   </div>
                </section>
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER BAR */}
      <footer className="h-8 border-t bg-card/50 flex items-center justify-between px-3 text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Cloudflare Workers: Online</span>
           <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> D1 Database: Connected</span>
        </div>
        <div className="flex items-center gap-4">
           <span>Version 2.4.0-antigravity</span>
           <span>UTF-8</span>
        </div>
      </footer>
    </div>
  );
}
