import cssText from "data-text:~/contents/command-k.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"

// Import KBar styles

// Inject to the webpage itself
import { KBarAnimator, KBarPortal, KBarPositioner, KBarProvider, KBarResults, KBarSearch, useMatches } from "kbar"
import "./command-k.css"

export const config: PlasmoCSConfig = {
  matches: ["https://www.google.com/*"]
}

// Inject into the ShadowDOM
export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

export const getShadowHostId = () => "plasmo-google-sidebar"

const actions = [
  {
    id: "theme-dark",
    name: "Change theme...",
    shortcut: ["d"],
    keywords: "dark theme appearance",
    section: "Preferences",
  },
  {
    id: "theme-dark-sub",
    name: "Dark",
    keywords: "dark theme",
    parent: "theme-dark",
    perform: () => document.documentElement.classList.add("dark"),
  },
  {
    id: "theme-light-sub",
    name: "Light",
    keywords: "light theme",
    parent: "theme-dark",
    perform: () => document.documentElement.classList.remove("dark"),
  },
  {
    id: "home",
    name: "Home",
    shortcut: ["h"],
    keywords: "home",
    section: "Navigation",
    subtitle: "Subtitles can help add more context.",
    perform: () => window.location.pathname = "/",
  }
]

function RenderResults() {
  const { results } = useMatches()

  return (
    <KBarResults
      items={results}
      onRender={({ item, active }) =>
        typeof item === "string" ? (
          <div style={{
            padding: "8px 16px",
            fontSize: "12px",
            color: "#9CA3AF",
            textTransform: "uppercase",
            letterSpacing: "0.5px"
          }}>
            {item}
          </div>
        ) : (
          <div
            style={{
              padding: "12px 16px",
              background: active ? "rgba(255, 255, 255, 0.05)" : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
              color: active ? "#fff" : "#E5E7EB",
              gap: "8px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <span style={{ fontSize: "14px" }}>{item.name}</span>
              {item.subtitle && (
                <span style={{ fontSize: "12px", color: "#9CA3AF" }}>{item.subtitle}</span>
              )}
            </div>
            {item.shortcut?.length ? (
              <span style={{ display: "grid", gridAutoFlow: "column", gap: "4px" }}>
                {item.shortcut.map((sc) => (
                  <kbd
                    key={sc}
                    style={{
                      padding: "2px 6px",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "4px",
                      fontSize: "12px",
                      color: "#9CA3AF",
                      fontFamily: "system-ui, sans-serif",
                      fontWeight: "400"
                    }}
                  >
                    {sc}
                  </kbd>
                ))}
              </span>
            ) : null}
          </div>
        )
      }
    />
  )
}

const GoogleSidebar = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle("plasmo-google-sidebar-show", isOpen)
  }, [isOpen])

  useEffect(() => {
    // Listen for messages from the background script
    const messageListener = (message: { type: string }, sender, sendResponse) => {
      if (message.type === "TOGGLE_SIDEBAR") {
        setIsOpen((prev) => !prev)
        sendResponse({ success: true, newState: !isOpen })
      }
      return true // Keep the message channel open for the async response
    }

    chrome.runtime.onMessage.addListener(messageListener)

    // Cleanup listener on unmount
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener)
    }
  }, [isOpen])

  return (
    <div id="sidebar" className={isOpen ? "open" : "closed"}>
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? "🟡 Close" : "🟣 Open"}
      </button>
      <p>The Easiest Way to Build, Test, and Ship browser extensions</p>
      <KBarProvider actions={actions}>
        <KBarPortal>
          <KBarPositioner style={{
            position: "fixed",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            width: "100%",
            inset: "0px",
            padding: "14vh 16px 16px",
            background: "rgba(0, 0, 0, 0.6)",
            boxSizing: "border-box",
            zIndex: 9999,
          }}>
            <KBarAnimator style={{
              maxWidth: "600px",
              width: "100%",
              background: "#1F2937",
              color: "#fff",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}>
              <KBarSearch 
                style={{
                  padding: "12px 16px",
                  fontSize: "16px",
                  width: "100%",
                  boxSizing: "border-box",
                  outline: "none",
                  border: "none",
                  margin: 0,
                  background: "#1F2937",
                  color: "#fff",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
                }}
                placeholder="Type a command or search..."
              />
              <RenderResults />
            </KBarAnimator>
          </KBarPositioner>
        </KBarPortal>
      </KBarProvider>
    </div>
  )
}

export default GoogleSidebar