import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import { useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import CardDados from './Components/CardDados'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import LocalPhoneIcon from '@mui/icons-material/LocalPhone'
import AccountBoxIcon from '@mui/icons-material/AccountBox'

import EmailIcon from '@mui/icons-material/Email'
import { formatDate } from '../../utils/Utils'
import { fomartCPF } from '../../views/regencia/Cards/Utils/FormatInput'
import { WhatsApp } from '@mui/icons-material'
import HomeIcon from '@mui/icons-material/Home'

export function useModal() {
  const [visible, setVisible] = useState(false)
  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  return [visible, open, close]
}

export function ModalData({ visible, close, data }) {
  return (
    <CModal visible={visible} onClose={close}>
      <CModalHeader></CModalHeader>
      <CModalBody>
        <CRow>
          <CCol className="d-flex flex-column align-items-center gap-2">
            <AccountCircleIcon
              style={{
                fontSize: 65,
              }}
            />

            <h5>{data.name}</h5>
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CardDados
              title={'Dados Pessoais'}
              icon={<AccountBoxIcon />}
              dados={[
                { title: 'Data de Nascimento', value: formatDate(data?.birth) },
                { title: 'CPF', value: data.cpf },
                { title: 'Codigo do Lider', value: data?.uid },
              ]}
            />

            <CardDados
              title={'Contato'}
              icon={<EmailIcon />}
              dados={[
                { title: 'E-mail', value: data?.email },
                {
                  title: data?.leaders_contact?.mode == 'lw' ? 'WhatsApp' : 'Telefone',
                  value: (
                    <CBadge
                      style={{ fontSize: 14 }}
                      color={data.leaders_contact?.mode == 'lw' ? 'success' : 'primary'}
                    >
                      {data.leaders_contact?.mode == 'lw' ? (
                        <WhatsAppIcon className="me-1" />
                      ) : (
                        <LocalPhoneIcon className="me-1" />
                      )}
                      ({data.leaders_contact?.ddd}) {data.leaders_contact?.phone}
                    </CBadge>
                  ),
                },
              ]}
            />

            <CardDados
              title={'Endereço'}
              icon={<HomeIcon />}
              dados={[
                {
                  title: 'Logradouro',
                  value: `${data?.leaders_address?.street}, Nº ${data?.leaders_address?.home}, Q ${data?.leaders_address?.quatrain}`,
                },
                {
                  title: 'Complemento',
                  value: data?.leaders_address?.complement,
                },

                {
                  title: 'Bairro',
                  value: data?.leaders_address?.district,
                },
                {
                  title: 'Cidade',
                  value: data?.leaders_address?.city,
                },
              ]}
            />
          </CCol>
        </CRow>
        <CRow className="mt-3" xs={{ cols: 1, gutter: 2 }} md={{ cols: 2, gutter: 2 }}>
          <CCol>
            <CButton
              color={data.leaders_contact?.mode == 'lw' ? 'success' : 'primary'}
              className="w-100 text-white"
              onClick={() => {
                data.leaders_contact?.mode == 'lw'
                  ? window.open(
                      `https://wa.me/55${data.leaders_contact?.ddd}${data.leaders_contact?.phone}`,
                      '_blank',
                    )
                  : (window.location.href = `tel:+55${data.leaders_contact?.ddd}${data.leaders_contact?.phone}`)
              }}
            >
              {data.leaders_contact?.mode == 'lw' ? (
                <WhatsAppIcon className="me-1" />
              ) : (
                <LocalPhoneIcon className="me-1" />
              )}
              {'Entrar em Contato'}
            </CButton>
          </CCol>

          <CCol>
            <CButton color="danger" className="w-100 text-white" onClick={close}>
              Fechar
            </CButton>
          </CCol>
        </CRow>
      </CModalBody>
    </CModal>
  )
}
