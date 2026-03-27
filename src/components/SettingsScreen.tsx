import React, { useState } from "react";

const inputClasses = "flex h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 ring-offset-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
const labelClasses = "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200";
const buttonClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-zinc-950 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-zinc-50 text-zinc-900 hover:bg-zinc-200";
const cardClasses = "rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-sm overflow-hidden";
const tabClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-zinc-950 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
const activeTabClasses = "bg-zinc-950 text-zinc-50 shadow-sm";
const inactiveTabClasses = "text-zinc-400 hover:text-zinc-50";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState("Justin Bishop");
  const [email, setEmail] = useState("jmbish04@126colby.com");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workspace, setWorkspace] = useState("2026-job-hunter");
  const [theme, setTheme] = useState("dark");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Settings saved", { name, email, location, workspace, theme });
  };

  return (
    <div className="flex min-h-screen w-full flex-col bg-zinc-950 text-zinc-50 dark">
      <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-6xl gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-zinc-400">Manage your account settings and preferences.</p>
        </div>

        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-zinc-400" aria-label="Settings Navigation">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex w-full justify-start text-left ${activeTab === "profile" ? "font-semibold text-zinc-50" : "hover:text-zinc-50"}`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("workspace")}
              className={`flex w-full justify-start text-left ${activeTab === "workspace" ? "font-semibold text-zinc-50" : "hover:text-zinc-50"}`}
            >
              Workspace
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`flex w-full justify-start text-left ${activeTab === "appearance" ? "font-semibold text-zinc-50" : "hover:text-zinc-50"}`}
            >
              Appearance
            </button>
          </nav>

          <div className="grid gap-6">
            {activeTab === "profile" && (
              <div className={cardClasses}>
                <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-800">
                  <h3 className="font-semibold leading-none tracking-tight">Profile</h3>
                  <p className="text-sm text-zinc-400">This is how others will see you on the site.</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="name" className={labelClasses}>Display Name</label>
                      <input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className={labelClasses}>Email</label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        readOnly
                        className={`${inputClasses} opacity-50 cursor-not-allowed`}
                      />
                      <p className="text-xs text-zinc-500">Your email is managed securely by Cloudflare Access.</p>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="location" className={labelClasses}>Location</label>
                      <input
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <button type="submit" className={buttonClasses}>Save changes</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "workspace" && (
              <div className={cardClasses}>
                <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-800">
                  <h3 className="font-semibold leading-none tracking-tight">Workspace</h3>
                  <p className="text-sm text-zinc-400">Manage your active IDE environment variables.</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="workspace" className={labelClasses}>Active Project Name</label>
                      <input
                        id="workspace"
                        value={workspace}
                        onChange={(e) => setWorkspace(e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={labelClasses}>Database Layer</label>
                      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-400">
                        Cloudflare D1 natively mapped via Drizzle ORM
                      </div>
                    </div>
                    <button type="submit" className={buttonClasses}>Update Workspace</button>
                  </form>
                </div>
              </div>
            )}

            {activeTab === "appearance" && (
              <div className={cardClasses}>
                <div className="flex flex-col space-y-1.5 p-6 border-b border-zinc-800">
                  <h3 className="font-semibold leading-none tracking-tight">Appearance</h3>
                  <p className="text-sm text-zinc-400">Customize the look and feel of your interface.</p>
                </div>
                <div className="p-6">
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="space-y-2">
                      <label className={labelClasses}>Theme</label>
                      <div className="flex items-center space-x-2 p-1 bg-zinc-800 rounded-md w-fit">
                        <button
                          type="button"
                          onClick={() => setTheme("light")}
                          className={`${tabClasses} ${theme === "light" ? activeTabClasses : inactiveTabClasses}`}
                        >
                          Light
                        </button>
                        <button
                          type="button"
                          onClick={() => setTheme("dark")}
                          className={`${tabClasses} ${theme === "dark" ? activeTabClasses : inactiveTabClasses}`}
                        >
                          Dark
                        </button>
                      </div>
                    </div>
                    <button type="submit" className={buttonClasses}>Save Preferences</button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
