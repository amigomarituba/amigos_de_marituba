import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CInputGroup,
  CInputGroupText,
  CRow,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import ModalDash from '../../components/Modal/ModalDash'
import { cilOptions, cilTerrain, cilUser } from '@coreui/icons'
import { useForm } from 'react-hook-form'
import { useEffect, useRef, useState } from 'react'
import { Form } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet'
import CardBody from 'rsuite/esm/Card/CardBody'
import { Card } from 'rsuite'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddIcon from '@mui/icons-material/Add'

import L from 'leaflet'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

import MapIcon from '@mui/icons-material/Map'
import 'leaflet/dist/leaflet.css'
const localizacoes = [
  {
    apelido: 'Centro',
    bairro: 'Centro',
    cidade: 'Marituba',
    lat: -1.3638061,
    lng: -48.3420802,
  },
  {
    apelido: 'Novo Horizonte',
    bairro: 'Novo Horizonte',
    cidade: 'Marituba',
    lat: -1.3695,
    lng: -48.3502,
  },
  {
    apelido: 'União',
    bairro: 'União',
    cidade: 'Marituba',
    lat: -1.3758,
    lng: -48.3375,
  },
  {
    apelido: 'Nova Marituba',
    bairro: 'Nova Marituba',
    cidade: 'Marituba',
    lat: -1.3542,
    lng: -48.3318,
  },
]

function FitMarlers({ markers }) {
  const map = useMap()

  useEffect(() => {
    if (markers.length > 0) {
      const bounds = markers.map((marker) => [marker.lat, marker.lng])

      map.fitBounds(bounds, {
        padding: [50, 50],
      })
    }
  }, [map, markers])

  return null
}

function MapController({ markers }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()

    const fitToMarkers = () => {
      if (markers.length > 0) {
        const bounds = markers.map((marker) => [marker.lat, marker.lng])
        map.fitBounds(bounds, { padding: [50, 50] })
      }
    }

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize()
      fitToMarkers()
    })

    resizeObserver.observe(container)

    // roda uma vez também, caso o container já tenha tamanho certo no mount
    fitToMarkers()

    return () => resizeObserver.disconnect()
  }, [map, markers])

  return null
}

// function ResizeMap() {
//   const map = useMap()

//   useEffect(() => {
//     const container = map.getContainer()

//     const resizeObserver = new ResizeObserver(() => {
//       map.invalidateSize()
//     })

//     resizeObserver.observe(container)

//     return () => resizeObserver.disconnect()
//   }, [map])

//   return null
// }

export default function Area() {
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm()

  const [bairro, setBairro] = useState(null)
  const [cidade, setCidade] = useState('marituba')

  const [local, setLocal] = useState(null)
  const [load, setLoad] = useState(false)

  const [linkLocalizacao, setLinkLocalizacao] = useState(null)

  const modalVisible = useRef()

  const CloseAdd = () => {
    reset({})
  }
  const submit = (input) => {
    console.log(input)
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

  const [visibleCollapse, setVisibleCollapse] = useState(false)

  useEffect(() => {
    if (!bairro || !cidade) {
      setLocal(null)
      return
    }

    const timer = setTimeout(async () => {
      setLoad(true)

      try {
        const query = encodeURIComponent(`${bairro}, ${cidade}, Pará, Brasil`)

        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1`,
        )

        const data = await response.json()

        setValue('link', `https://www.google.com/maps?q=${data[0].lat},${data[0].lon}`)

        if (data.length > 0) {
          setValue('latitude', Number(data[0].lat))
          setValue('longitude', Number(data[0].lon))

          setLocal({
            latitude: Number(data[0].lat),
            longitude: Number(data[0].lon),
          })
        } else {
          setLocal(null)
        }
      } finally {
        setLoad(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [bairro, cidade])

  return (
    <CContainer fluid>
      <CRow>
        <CCol>
          <CCard className="w-100 p-3">
            <CCardBody>
              <CRow>
                <CCol>
                  <div>
                    <h4>
                      <CBadge color="secondary">Próximo Módulo</CBadge>
                    </h4>
                    <h4>Áreas</h4>
                    <span>Gerenciamento de áreas</span>
                  </div>
                </CCol>

                <CCol className="d-flex align-items-center justify-content-end ">
                  <CButton
                    color="primary"
                    className="d-flex"
                    onClick={() => {
                      modalVisible.current.visibleModal()
                    }}
                  >
                    <AddIcon />
                    <span className="d-md-block d-none">Criar nova área</span>
                  </CButton>
                </CCol>
              </CRow>

              <CRow className="mt-2">
                <CCol className="text-uppercase">
                  <CBadge
                    color="primary"
                    className="me-3"
                    style={{
                      fontSize: 14,
                    }}
                  >
                    Total de Areas
                  </CBadge>
                  <strong>registros</strong>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-3">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-end">
              <CButton
                color="primary"
                onClick={() => {
                  setVisibleCollapse(!visibleCollapse)
                }}
              >
                <MapIcon />
                Mapa
              </CButton>
            </CCardHeader>
            <CardBody>
              <CCollapse visible={visibleCollapse}>
                <MapContainer
                  // center={[local.latitude, local.longitude]}

                  style={{
                    height: '49vh',
                    width: '100%',
                  }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {localizacoes.map((maker, index) => (
                    <Marker key={index} position={[maker.lat, maker.lng]} />
                  ))}

                  <MapController markers={localizacoes} />
                  {/* <ResizeMap /> */}
                </MapContainer>
              </CCollapse>

              <CTable responsive className="mt-3">
                <CTableHead>
                  <CTableHeaderCell>Apelido</CTableHeaderCell>
                  <CTableHeaderCell>Bairro</CTableHeaderCell>
                  <CTableHeaderCell>Cidade</CTableHeaderCell>
                  <CTableHeaderCell>Link</CTableHeaderCell>
                  <CTableHeaderCell>Ação</CTableHeaderCell>
                </CTableHead>
                <CTableBody>
                  {localizacoes.map((loc) => (
                    <CTableRow>
                      <CTableDataCell>
                        <MapIcon />
                        {loc.apelido}
                      </CTableDataCell>
                      <CTableDataCell>{loc.bairro}</CTableDataCell>
                      <CTableDataCell>{loc.cidade}</CTableDataCell>
                      <CTableDataCell>https://googlemap/q=asdasdasd</CTableDataCell>
                      <CTableDataCell>
                        <CDropdown>
                          <CDropdownToggle>
                            <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                          </CDropdownToggle>
                          <CDropdownMenu>
                            <CDropdownItem>Excluir</CDropdownItem>
                            <CDropdownItem>Ver</CDropdownItem>
                            <CDropdownItem>Editar</CDropdownItem>
                          </CDropdownMenu>
                        </CDropdown>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CardBody>
          </CCard>
        </CCol>
      </CRow>

      <ModalDash
        title="Criar/Atualizar Área"
        icon={cilTerrain}
        CloseAdd={CloseAdd}
        handleButtonSalveModal={handleButtonSalveModal}
        ref={modalVisible}
        isSpinner={isSubmitting}
        lider={false}
      >
        <CForm onSubmit={handleSubmit(submit)}>
          <CRow>
            <CCol>
              <CFormInput label="Apelido" {...register('apelido', { required: true })} />
              <hr />
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              <CFormLabel>
                <h6>Localização</h6>
              </CFormLabel>
            </CCol>
          </CRow>

          <CRow md={{ cols: 2 }} xs={{ cols: 1 }}>
            <CCol>
              <CInputGroup>
                <CInputGroupText>Bairro</CInputGroupText>
                <CFormInput
                  value={bairro}
                  {...register('bairro', {
                    required: true,

                    onChange: (e) => {
                      setBairro(e.target.value)
                    },
                  })}
                  placeholder="bairro"
                />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup>
                <CInputGroupText>Cidade</CInputGroupText>
                <CFormInput
                  {...register('cidade', {
                    required: true,
                    value: cidade,
                    onChange: (e) => {
                      setCidade(e.target.value)
                    },
                  })}
                  placeholder="cidade"
                />
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol>
              {local ? (
                <CCard className="p-3 mt-3">
                  <CCardHeader>
                    {`Localização: ${bairro?.toUpperCase()}, ${cidade?.toUpperCase()}`}
                  </CCardHeader>
                  <CardBody>
                    <MapContainer
                      center={[local.latitude, local.longitude]}
                      zoom={15}
                      style={{
                        height: '300px',
                        width: '100%',
                      }}
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      <Marker position={[local.latitude, local.longitude]} />
                    </MapContainer>
                  </CardBody>
                </CCard>
              ) : (
                <CCard className="mt-3">
                  <CardBody className="p-4">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      {load ? (
                        <CSpinner />
                      ) : (
                        <>
                          <MapIcon style={{ fontSize: 65 }} />
                          <h6>mapa da área</h6>
                        </>
                      )}
                    </div>
                  </CardBody>
                </CCard>
              )}
            </CCol>
          </CRow>

          <CRow className="mt-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText>Link</CInputGroupText>
                <CFormInput
                  readOnly
                  placeholder="localização"
                  value={linkLocalizacao}
                  {...register('link')}
                />
                {/* <CButton color="primary" variant="outline">
                  <ContentCopyIcon />
                </CButton> */}
              </CInputGroup>
            </CCol>
          </CRow>

          <CRow className="mt-3">
            <CCol>
              <CFormTextarea label="observação" {...register('obs')} />
            </CCol>
          </CRow>

          <input type="submit" hidden id="submitbtn" />
        </CForm>
      </ModalDash>
    </CContainer>
  )
}
