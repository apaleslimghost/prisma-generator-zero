import { generateZeroSchema } from '../generate'
import { getSampleDMMF } from './__fixtures__/getSampleDMMF'

test('enum generation', async () => {
  const sampleDMMF = await getSampleDMMF()

  sampleDMMF.datamodel.enums.forEach((enumInfo) => {
    expect(generateZeroSchema(enumInfo)).toMatchSnapshot(enumInfo.name)
  })
})
