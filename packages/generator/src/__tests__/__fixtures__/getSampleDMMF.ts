import { getDMMF, getSchema } from '@prisma/sdk'
import path from 'path'

export const getSampleDMMF = async () => {
  return getDMMF({
    datamodel: await getSchema(path.join(__dirname, './sample.prisma')),
  })
}
