import config from '@payload-config'
import '@payloadcms/next/css'
import { handleServerFunctions, RootLayout } from '@payloadcms/next/layouts'
import type { ReactNode } from 'react'
import { importMap } from './admin/importMap'

export default function PayloadLayout({ children }: { children: ReactNode }) {
  return RootLayout({
    children,
    config,
    importMap,
    serverFunction: (args) => handleServerFunctions({ ...args, config, importMap }),
  })
}
