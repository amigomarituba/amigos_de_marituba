export function dataExtenso(data) {
  if (!data) return ''

  const [ano, mes, dia] = data.split('-')

  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(ano, mes - 1, dia))
}
