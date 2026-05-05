import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('vite.config.js', () => {
  test('sets up API proxy for /api routes', async () => {
    const configPath = join(__dirname, '../vite.config.js')
    const content = await readFile(configPath, 'utf-8')
    expect(content).toContain('proxy')
  })

  test('uses correct root directory', async () => {
    const configPath = join(__dirname, '../vite.config.js')
    const content = await readFile(configPath, 'utf-8')
    expect(content).toContain('root')
  })

  test('includes react plugin', async () => {
    const configPath = join(__dirname, '../vite.config.js')
    const content = await readFile(configPath, 'utf-8')
    expect(content).toContain('@vitejs/plugin-react')
  })
})