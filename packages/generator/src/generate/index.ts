import { DMMF } from '@prisma/generator-helper'
import ts, { factory } from 'typescript'

const generateEnumDefinition = (enumeration: DMMF.DatamodelEnum) => factory.createPropertyAssignment(
  enumeration.name,
  factory.createCallExpression(
    factory.createIdentifier("enumeration"),
    enumeration.values.map(value =>
      factory.createLiteralTypeNode(factory.createStringLiteral(value.name)),
    ),
    []
  )
)

export const generateEnumsMap = (enums: DMMF.DatamodelEnum[]) => factory.createVariableDeclarationList(
  [factory.createVariableDeclaration(
    factory.createIdentifier("enums"),
    undefined,
    undefined,
    factory.createObjectLiteralExpression(
      enums.map(generateEnumDefinition),
      true
    )
  )],
  ts.NodeFlags.Const
)

const prismaTypeToZeroType = (type: string) => {
  switch(type) {
    case 'Boolean':
      return 'boolean'
    case 'BigInt':
    case 'Float':
    case 'Int':
    case 'Decimal':
    case 'DateTime':
      return 'number'
    case 'String':
      return 'string'
    case 'Json':
      return 'json'
    default:
      throw new Error(`Prisma type ${type} is not supported`)
  }
}

const generateModelDefinition = (model: DMMF.Model) => {
  const idField = model.fields.find(
              field => field.isId
            )

  return factory.createPropertyAssignment(
    model.name,
    factory.createCallExpression(
      factory.createIdentifier("createTableSchema"),
      undefined,
      [
        factory.createObjectLiteralExpression([
          factory.createPropertyAssignment(
            'tableName',
            factory.createStringLiteral(
              model.dbName ?? model.name
            )
          ),
          factory.createPropertyAssignment(
            'columns',
            factory.createObjectLiteralExpression(
              model.fields.map(
                field => factory.createPropertyAssignment(
                  field.dbNames ? field.dbNames[0] : field.name,
                  field.isRequired ?
                    factory.createStringLiteral(
                      prismaTypeToZeroType(field.type)
                    ) :
                    factory.createObjectLiteralExpression([
                      factory.createPropertyAssignment('type', factory.createStringLiteral(
                        prismaTypeToZeroType(field.type)
                      )),
                      factory.createPropertyAssignment('optional', factory.createTrue()),
                    ])
                )
              )
            , true),
          ),
          ...(idField ? [
            factory.createPropertyAssignment(
              'primaryKey',
              factory.createStringLiteral(idField.dbNames ? idField.dbNames[0] : idField.name)
            )
          ] : [])
        ], true)
      ]
    )
  )
}

export const generateModelMap = (models: DMMF.Model[]) => factory.createVariableDeclarationList(
  [factory.createVariableDeclaration(
    factory.createIdentifier("models"),
    undefined,
    undefined,
    factory.createObjectLiteralExpression(
      models.map(generateModelDefinition),
      true
    )
  )],
  ts.NodeFlags.Const
)

export const generateZeroSchema = (datamodel: DMMF.Datamodel) => {
  console.log(datamodel)

  const enums = generateEnumsMap(datamodel.enums)

  const models = Object.fromEntries(
    datamodel.models.map(
      model => [
        model.dbName ?? model.name,
      ]
    )
  )

  return ''
}
