import { readFile } from 'fs/promises'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

describe('index.html', () => {
  test('contains root div for React mounting', async () => {
    const htmlPath = join(__dirname, '../index.html')
    const content = await readFile(htmlPath, 'utf-8')
    expect(content).toContain('<div id="root">')
  })

  test('includes Vite script for main entry', async () => {
    const htmlPath = join(__dirname, '../index.html')
    const content = await readFile(htmlPath, 'utf-8')
    expect(content).toContain('/src/main.jsx')
  })

  test('sets correct meta charset', async () => {
    const htmlPath = join(__dirname, '../index.html')
    const content = await readFile(htmlPath, 'utf-8')
    expect(content).toContain('charset="UTF-8"')
  })
})