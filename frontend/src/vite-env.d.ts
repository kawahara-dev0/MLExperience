/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEBAPI_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
