import fs from 'fs/promises'
import path from 'path'
import { formatFile } from './format-file'

export const writeFileWithDirectory = async (writeLocation: string, content: string) => {
  await fs.mkdir(path.dirname(writeLocation), {
    recursive: true,
  })

  return fs.writeFile(writeLocation, await formatFile(content))
}
