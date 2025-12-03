// src/js/ipc-fallback.ts

// Only run in environments with globalThis
if (typeof globalThis !== "undefined") {
  const g: any = globalThis as any;

  // If Electron already provided ipcRenderer, don't touch it
  if (!g.ipcRenderer) {
    console.warn("[shapez] ipcRenderer not found – using browser stub");

    g.ipcRenderer = {
      // Electron's ipcRenderer.invoke returns a Promise
      async invoke(channel: string, ...args: any[]) {
        console.warn(`[ipcRenderer stub] invoke(${channel})`, args);

        // Mod loader: "get-mods" → no mods in web version
        if (channel === "get-mods") {
          return [];
        }

        // Fullscreen toggle etc.: just pretend success
        if (channel === "set-fullscreen") {
          return true;
        }

        // Anything else: return null / no-op
        return null;
      },

      // Fire-and-forget messages → do nothing
      send(channel: string, ...args: any[]) {
        console.warn(`[ipcRenderer stub] send(${channel})`, args);
      },

      // Event listeners → do nothing
      on(channel: string, listener: (...args: any[]) => void) {
        console.warn(`[ipcRenderer stub] on(${channel}) – no-op in web build`);
        // Return dummy unsubscribe
        return () => {};
      },
    };
  }
}
