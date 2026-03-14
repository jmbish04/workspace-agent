import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Activity,
  Database,
  Cpu,
  Lock,
  RefreshCw
} from "lucide-react";

export default function HealthDashboard() {
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  const statusData = [
    { name: "D1 Database", status: "Operational", metric: "12ms avg latency", icon: Database },
    { name: "AI Gateway", status: "Online", metric: "100% uptime (30d)", icon: Cpu },
    { name: "Auth Service", status: "Healthy", metric: "14,205 active sessions", icon: Lock },
  ];

  const recentEvents = [
    { event: "Automatic Scale Out", status: "Completed", component: "Compute Node-US-East", time: "2 mins ago" },
    { event: "Latency Spike Detected", status: "Resolved", component: "D1 Database", time: "14 mins ago" },
    { event: "System Health Check", status: "Healthy", component: "Core API Gateway", time: "1 hour ago" },
    { event: "Token Refresh Delay", status: "Healthy", component: "Auth Service", time: "3 hours ago" },
    { event: "Scheduled Backup", status: "Completed", component: "Persistent Storage", time: "12 hours ago" },
  ];

  return (
    <div className="p-8 space-y-8 bg-background min-h-screen text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">System Health</h1>
          <p className="text-muted-foreground">Real-time status monitoring for all core platform services.</p>
        </div>
        <Button onClick={handleScan} disabled={isScanning}>
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Run Health Scan
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall System Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">99.9%</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-none">
                HEALTHY
              </Badge>
            </div>
            <Progress value={99.9} className="mt-4" />
            <p className="text-xs text-muted-foreground mt-2">
              Last check performed 2 minutes ago
            </p>
          </CardContent>
        </Card>

        {statusData.map((item) => (
          <Card key={item.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.status}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {item.metric}
              </p>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-muted-foreground">Operational</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent System Events</CardTitle>
          <CardDescription>
            Audit log of system health fluctuations and maintenance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Component</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentEvents.map((event, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{event.event}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === "Healthy" ? "default" : "secondary"}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{event.component}</TableCell>
                  <TableCell className="text-right">{event.time}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
