import { generatorHandler, GeneratorOptions } from '@prisma/generator-helper'
import { logger } from '@prisma/sdk'
import path from 'path'
import { GENERATOR_NAME } from './constants'
import { generateZeroSchema } from './generate'
import { writeFileWithDirectory } from './utils/write-file-with-directory'

const { version } = require('../package.json')

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`)
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    }
  },
  onGenerate: async (options: GeneratorOptions) => {
    options.dmmf.datamodel.enums.forEach(async (enumInfo) => {
      const tsEnum = generateZeroSchema(enumInfo)

      if(!options.generator.output) {
        throw new Error('expected output in generator options')
      }

      const writeLocation = path.join(
        options.generator.output.value,
        `${enumInfo.name}.ts`,
      )

      await writeFileWithDirectory(writeLocation, tsEnum)
    })
  },
})
