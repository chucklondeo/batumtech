import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import { importMap } from '../importMap'

type PageArgs = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: PageArgs): Promise<Metadata> =>
  generatePageMetadata({ config, params, searchParams })

export default function AdminPage({ params, searchParams }: PageArgs) {
  return RootPage({ config, importMap, params, searchParams })
}
