import moment from 'moment/moment'

const formatDate = (date) => {
  const data = moment(date).locale('pt-br')
  const dataF = data.format('DD/MM/YYYY')
  return dataF
}

const formatDateN = (date) => {
  const data = moment(date).locale('pt-br')
  const dataF = data.format('YYYY-MM-DD')
  return dataF
}

const formatNumber = (number) => {}
export { formatDate, formatDateN }
