window.__ModuleLoader__.load({
  id: "dsh-file-export",
  factory: (require) => {
    var module = { exports: {} }
    var exports = module.exports
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client/index.js
var index_exports = {};
__export(index_exports, {
  apply: () => apply,
  inject: () => inject
});
module.exports = __toCommonJS(index_exports);
var import_react3 = __toESM(require("react"), 1);

// src/client/action.js
var import_react2 = __toESM(require("react"), 1);

// src/client/download.js
function contentType(name) {
  const extension = String(name ?? "").split(".").pop().toLowerCase();
  const types = {
    pdf: "application/pdf",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ppt: "application/vnd.ms-powerpoint",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    txt: "text/plain",
    md: "text/markdown",
    csv: "text/csv"
  };
  return types[extension] ?? "application/octet-stream";
}
function describe(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return `array(length ${value.length})`;
  if (typeof value !== "object") return typeof value;
  const keys = Object.keys(value);
  return keys.length === 0 ? "object(no keys)" : `object(keys: ${keys.slice(0, 8).join(", ")})`;
}
function toBytes(data) {
  if (data instanceof Uint8Array) return new Uint8Array(data);
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) {
    return new Uint8Array(data.buffer, data.byteOffset, data.byteLength).slice();
  }
  if (data !== null && typeof data === "object" && "data" in data) return toBytes(data.data);
  if (Array.isArray(data)) return Uint8Array.from(data);
  throw new Error(`workspaceFiles.readBytes returned no binary data (${describe(data)})`);
}
function unwrapResult(response) {
  if (response === null || typeof response !== "object") return response;
  if (typeof response.ok === "boolean") {
    if (!response.ok) {
      const error = response.error;
      const message = typeof error?.message === "string" ? error.message : "";
      const code = typeof error?.code === "string" ? error.code : "";
      throw new Error(message || code || "workspaceFiles.readBytes failed");
    }
    return response.value;
  }
  if ("result" in response) return response.result;
  return response;
}
async function downloadFile(workspaceFiles, sessionId, absolutePath, name) {
  const response = await workspaceFiles.readBytes(sessionId, absolutePath, {});
  const file = unwrapResult(response);
  const payload = file?.data === void 0 ? file : file.data;
  const data = toBytes(payload);
  if (data.byteLength === 0 && Number(file?.bytes) > 0) {
    throw new Error("workspaceFiles.readBytes returned an empty file");
  }
  if (file?.eof === false || Number(file?.bytes) > data.byteLength) {
    throw new Error("workspaceFiles.readBytes returned an incomplete file");
  }
  const blob = new Blob([data], { type: contentType(name) });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name || "download";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 3e4);
}

// src/client/glyphs.js
var import_react = __toESM(require("react"), 1);
var h = import_react.default.createElement;
function DownloadGlyph() {
  return h("svg", {
    width: 13,
    height: 13,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true
  }, h("path", { d: "M8 2.5v7.5" }), h("path", { d: "m5 7.5 3 3 3-3" }), h("path", { d: "M3.5 12v1.5h9V12" }));
}
function SpinnerGlyph() {
  return h("svg", {
    className: "dfd-spinner",
    width: 15,
    height: 15,
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    "aria-hidden": true
  }, h("path", { d: "M13 8a5 5 0 1 1-2.1-4.08" }));
}

// src/client/action.js
var h2 = import_react2.default.createElement;
function DownloadAction(props) {
  const { absolutePath, sessionId, t, workspaceFiles } = props;
  const [downloading, setDownloading] = import_react2.default.useState(false);
  if (typeof absolutePath !== "string" || absolutePath === "") return null;
  const name = absolutePath.split(/[\\/]/).pop() || absolutePath;
  const download = async () => {
    setDownloading(true);
    try {
      await downloadFile(workspaceFiles, sessionId, absolutePath, name);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      window.alert(t("view.downloadError", { message }));
    } finally {
      setDownloading(false);
    }
  };
  const label = downloading ? t("view.downloading") : t("view.downloadNamed", { name });
  return h2("button", {
    type: "button",
    className: "dfd-docbtn",
    title: label,
    "aria-label": label,
    "aria-busy": downloading,
    disabled: downloading,
    onClick: download
  }, downloading ? h2(SpinnerGlyph) : h2(DownloadGlyph));
}

// src/client/locale.js
var NS = "dsh-file-export";
var zh = {
  "view.download": "\u4E0B\u8F7D",
  "view.downloading": "\u4E0B\u8F7D\u4E2D\u2026",
  "view.downloadNamed": "\u4E0B\u8F7D {name}",
  "view.downloadError": "\u6587\u4EF6\u4E0B\u8F7D\u5931\u8D25\uFF1A{message}"
};
var en = {
  "view.download": "Download",
  "view.downloading": "Downloading\u2026",
  "view.downloadNamed": "Download {name}",
  "view.downloadError": "File download failed: {message}"
};

// src/client/styles.js
var CSS = [
  ".dfd-docbtn{flex:none;align-self:center;display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;box-sizing:border-box;padding:0;border:0;border-radius:6px;background:transparent;color:var(--dsw-alias-label-secondary);cursor:pointer}",
  ".dfd-docbtn:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}",
  ".dfd-docbtn:focus-visible{background:var(--dsw-alias-bg-layer-2);outline:2px solid var(--dsw-alias-brand-primary);outline-offset:1px}",
  ".dfd-docbtn[disabled]{opacity:.5;cursor:default}",
  ".dfd-spinner{transform-origin:center}",
  ".dfd-docbtn[disabled] .dfd-spinner{animation:dfd-spin .8s linear infinite}",
  "@keyframes dfd-spin{to{transform:rotate(360deg)}}"
].join("\n");
function injectStyles(namespace) {
  if (typeof document === "undefined") return;
  const selector = `style[data-plugin-css=${JSON.stringify(namespace)}]`;
  if (document.querySelector(selector) !== null) return;
  const tag = document.createElement("style");
  tag.dataset.plugin = namespace;
  tag.dataset.pluginCss = namespace;
  tag.textContent = CSS;
  document.head.appendChild(tag);
}

// src/client/index.js
var h3 = import_react3.default.createElement;
var inject = ["slots", "locale", "remote", "remote.workspaceFiles"];
function apply(ctx) {
  ctx.effect(() => injectStyles(NS), "dsh-file-export: styles");
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "dsh-file-export: dictionaries");
  ctx.slots.inject("sidebar.right.tab.document.actions", () => ctx.slots.register({
    name: "sidebar.right.tab.document.actions",
    id: "dsh-file-export",
    order: 40,
    locale: NS
  }, (props) => h3(DownloadAction, {
    ...props,
    t: ctx.locale.bind(NS),
    workspaceFiles: ctx.remote.workspaceFiles
  })));
}

    return module.exports
  }
})
