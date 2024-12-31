import { getDMMF } from '@prisma/sdk'
import {
  generateEnumsMap,
  generateModelMap,
  generateZeroSchema,
} from '../generate'
import { getSampleDMMF } from './__fixtures__/getSampleDMMF'
import ts from 'typescript'

const printNode = (node: ts.Node) =>
  ts
    .createPrinter({ newLine: ts.NewLineKind.LineFeed })
    .printNode(
      ts.EmitHint.Unspecified,
      node,
      ts.createSourceFile('test.ts', '', ts.ScriptTarget.Latest),
    )

test('enum generation', async () => {
  const dmmf = await getDMMF({
    datamodel: `
    enum Test {
      One
      Two
      Three
    }
    `,
  })

  expect(printNode(generateEnumsMap(dmmf.datamodel.enums)))
    .toMatchInlineSnapshot(`
    "const enums = {
        Test: enumeration<"One", "Two", "Three">()
    }"
  `)
})

test('model generation', async () => {
  const dmmf = await getDMMF({
    datamodel: `
    model Post {
      id       Int    @id @default(autoincrement())
      title    String
      slug     String? @unique
      contents Json
    }
    `,
  })

  expect(printNode(generateModelMap(dmmf.datamodel.models)))
    .toMatchInlineSnapshot(`
    "const models = {
        Post: createTableSchema({
            tableName: "Post",
            columns: {
                id: "number",
                title: "string",
                slug: { type: "string", optional: true },
                contents: "json"
            },
            primaryKey: "id"
        })
    }"
  `)
})
