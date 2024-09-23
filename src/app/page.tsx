"use client";

import { useState, useEffect } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  Instagram,
  ExternalLink,
  UserPlus,
  UserMinus,
  Search,
  Eye,
  EyeOff,
  Wifi,
  WifiOff,
} from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { useWebSocket } from "@/hooks/useWebSockets";

const queryClient = new QueryClient();

interface Notification {
  type: "newFollower" | "lostFollower";
  username: string;
  follower: string;
}

function SpygramApp() {
  const [username, setUsername] = useState("");
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  const { isConnected, lastMessage, sendMessage } = useWebSocket(
    process.env.NEXT_PUBLIC_WS_URL || ""
  );

  const {
    data: followers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["followers", username],
    queryFn: () =>
      api
        .get(`/api/users/${username}/followers`)
        .then((res) => res.data.followers),
    enabled: !!username,
  });

  useEffect(() => {
    if (lastMessage) {
      const { type, data } = lastMessage;
      setNotifications((prev) =>
        [{ type, ...data } as Notification, ...prev].slice(0, 5)
      );
      toast({
        title: type === "newFollower" ? "New Follower" : "Lost Follower",
        description: `@${data.follower} has ${
          type === "newFollower" ? "followed" : "unfollowed"
        } @${data.username}`,
      });
    }
  }, [lastMessage, toast]);

  const handleMonitorToggle = () => {
    const message = isMonitoring
      ? JSON.stringify({ type: "stopMonitor", username })
      : JSON.stringify({ type: "monitor", username });
    sendMessage(message);
    setIsMonitoring(!isMonitoring);
    toast({
      title: isMonitoring ? "Monitoring Stopped" : "Monitoring Started",
      description: `${
        isMonitoring ? "Stopped monitoring" : "Now monitoring"
      } @${username}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b border-gray-800">
        <Link className="flex items-center justify-center" href="#">
          <Instagram className="h-8 w-8 text-purple-500" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
            Spygram
          </span>
        </Link>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            Privacy
          </Link>
          <Link
            className="text-sm font-medium hover:text-purple-400 transition-colors"
            href="#"
          >
            Contact
          </Link>
        </nav>
        {isConnected ? (
          <Wifi className="h-5 w-5 text-green-500" />
        ) : (
          <WifiOff className="h-5 w-5 text-red-500" />
        )}
      </header>
      <main className="flex-1 flex flex-col items-center">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 flex items-center justify-center">
          <div className="container px-4 md:px-6 max-w-4xl mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Discover Instagram Connections
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">
                  Enter an Instagram username to explore their followers and
                  following lists.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <form
                  className="flex space-x-2"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <Input
                    className="max-w-lg flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                    placeholder="Enter Instagram username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </form>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="monitor-mode"
                  checked={isMonitoring}
                  onCheckedChange={handleMonitorToggle}
                  disabled={!isConnected || !username}
                />
                <label
                  htmlFor="monitor-mode"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {isMonitoring ? "Monitoring" : "Monitor"} @{username}
                </label>
                {isMonitoring ? (
                  <Eye className="h-4 w-4 text-green-500" />
                ) : (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                )}
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800">
          <div className="container px-4 md:px-6 max-w-6xl mx-auto">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-purple-400">
                  Followers
                </h2>
                <Input
                  className="max-w-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  placeholder="Search followers"
                  type="search"
                />
                <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700">
                  <div className="p-4">
                    {isLoading && <p>Loading followers...</p>}
                    {error && <p>Error loading followers</p>}
                    {followers &&
                      followers.map((follower: string, i: number) => (
                        <Link
                          key={i}
                          className="flex items-center space-x-4 rounded-lg p-2 transition-colors hover:bg-gray-700"
                          href="#"
                        >
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              {follower}
                            </p>
                            <p className="text-sm text-gray-400">@{follower}</p>
                          </div>
                          <ExternalLink className="ml-auto h-4 w-4 text-gray-400" />
                        </Link>
                      ))}
                  </div>
                </ScrollArea>
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-pink-400">
                  Recent Activity
                </h2>
                <ScrollArea className="h-[300px] w-full rounded-md border border-gray-700">
                  <div className="p-4">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-4 bg-gray-700 p-4 rounded-lg mb-4"
                      >
                        {notification.type === "newFollower" ? (
                          <UserPlus className="h-6 w-6 text-green-500" />
                        ) : (
                          <UserMinus className="h-6 w-6 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">
                            {notification.type === "newFollower"
                              ? "New Follower"
                              : "Lost Follower"}
                          </p>
                          <p className="text-xs text-gray-400">
                            @{notification.follower}
                          </p>
                        </div>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <p className="text-center text-gray-400">
                        No recent activity
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2023 Spygram. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-xs hover:text-purple-400 transition-colors"
            href="#"
          >
            Terms of Service
          </Link>
          <Link
            className="text-xs hover:text-purple-400 transition-colors"
            href="#"
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <SpygramApp />
    </QueryClientProvider>
  );
}
