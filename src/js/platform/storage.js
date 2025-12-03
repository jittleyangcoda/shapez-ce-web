// src/js/platform/storage_browser.js

import { createLogger } from "../core/logging";

const FILE_NOT_FOUND = "file-not-found";

const logger = createLogger("storage/browser");

export class StorageImplBrowser {
    constructor(app) {
        this.app = app;
    }

    async initialize() {
        if (!window.localStorage) {
            throw new Error("LocalStorage not available in this browser");
        }
        try {
            window.localStorage.setItem("storage_test", "ok");
            window.localStorage.removeItem("storage_test");
        } catch (e) {
            throw new Error("Cannot write to localStorage");
        }
    }

    async writeFileAsync(filename, contents) {
        try {
            // Automatically JSON-stringify objects
            const data = typeof contents === "string" ? contents : JSON.stringify(contents);
            window.localStorage.setItem(filename, data);
            logger.log("📄 Saved", filename, "to localStorage");
        } catch (e) {
            logger.error("Failed to save", filename, e);
            throw e;
        }
    }

    async readFileAsync(filename) {
        const raw = window.localStorage.getItem(filename);
        if (!raw) {
            const err = new Error("file-not-found");
            err.isFileNotFound = () => true; // 👈  key fix
            throw err;
        }

        try {
            return JSON.parse(raw);
        } catch {
            return raw;
        }
    }

    async deleteFileAsync(filename) {
        window.localStorage.removeItem(filename);
    }
}
