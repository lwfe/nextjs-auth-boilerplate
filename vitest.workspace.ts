import dotenv from 'dotenv'
dotenv.config({ path: '.env' })

import path from 'path'
import react from '@vitejs/plugin-react'
import { defineWorkspace } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineWorkspace([
  {
    plugins: [react(), tsconfigPaths()],
    test: {
      name: 'FRONTEND',
      root: './tests/frontend',
      environment: 'jsdom'
    },
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, './src/')
      }
    }
  },
  {
    plugins: [tsconfigPaths()],
    test: {
      name: 'BACKEND',
      root: './tests/backend',
      environment: 'node',
      poolOptions: {
        threads: {
          singleThread: true
        }
      }
    },
    resolve: {
      alias: {
        '@/': path.resolve(__dirname, './src/')
      }
    }
  }
])
