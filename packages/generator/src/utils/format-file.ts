import prettier from 'prettier'

export const formatFile = async (content: string): Promise<string> => {
  const options = await prettier.resolveConfig(process.cwd())
  if (!options) {
    return content // no prettier config was found, no need to format
  }

  return prettier.format(content, {
    ...options,
    parser: 'typescript',
  })
}
