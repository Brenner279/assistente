"use strict";

const { app, BrowserWindow, Menu, dialog, shell } = require("electron");
const path = require("node:path");

const APP_URL = "https://brenner279.github.io/assistente/";
const APP_ORIGIN = new URL(APP_URL).origin;

let mainWindow;

function openExternalSafely(rawUrl) {
  try {
    const target = new URL(rawUrl);
    if (target.protocol !== "https:") return;
    shell.openExternal(target.href);
  } catch {
    // URLs inválidas são ignoradas.
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: "PEI Inteligente",
    width: 1440,
    height: 920,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#f5f8f6",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webviewTag: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // O aplicativo local só aceita incorporar o site oficial do PEI.
  mainWindow.webContents.on("will-attach-webview", (event, webPreferences, params) => {
    let requestedOrigin = "";
    try {
      requestedOrigin = new URL(params.src || "").origin;
    } catch {
      requestedOrigin = "";
    }

    if (requestedOrigin !== APP_ORIGIN) {
      event.preventDefault();
      return;
    }

    delete webPreferences.preload;
    webPreferences.nodeIntegration = false;
    webPreferences.contextIsolation = true;
    webPreferences.sandbox = true;
    webPreferences.webSecurity = true;
    webPreferences.allowRunningInsecureContent = false;
  });

  // Conteúdo externo permanece isolado e não pode navegar o aplicativo para outro domínio.
  mainWindow.webContents.on("did-attach-webview", (_event, guest) => {
    guest.setWindowOpenHandler(({ url }) => {
      openExternalSafely(url);
      return { action: "deny" };
    });

    guest.on("will-navigate", (event, url) => {
      let targetOrigin = "";
      try {
        targetOrigin = new URL(url).origin;
      } catch {
        targetOrigin = "";
      }

      if (targetOrigin !== APP_ORIGIN) {
        event.preventDefault();
        openExternalSafely(url);
      }
    });

    // Permissões de câmera, microfone, notificações e outros recursos não são necessárias.
    guest.session.setPermissionRequestHandler((_contents, _permission, callback) => {
      callback(false);
    });

    // Exportações Word/PDF são encaminhadas para a janela nativa "Salvar como".
    guest.session.on("will-download", (event, item) => {
      item.pause();
      const defaultPath = path.join(app.getPath("downloads"), item.getFilename());
      dialog.showSaveDialog(mainWindow, {
        title: "Salvar documento do PEI",
        defaultPath,
        buttonLabel: "Salvar"
      }).then(({ canceled, filePath }) => {
        if (canceled || !filePath) {
          item.cancel();
          return;
        }
        item.setSavePath(filePath);
        item.resume();
      }).catch(() => item.cancel());
    });
  });

  mainWindow.loadFile(path.join(__dirname, "shell.html"));
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.setAppUserModelId("br.com.peiinteligente.desktop");

app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
