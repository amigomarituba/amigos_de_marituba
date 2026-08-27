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
import { Circle, MapContainer, Marker, TileLayer, Tooltip, useMap } from 'react-leaflet'
import CardBody from 'rsuite/esm/Card/CardBody'
import { Card } from 'rsuite'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AddIcon from '@mui/icons-material/Add'
import RoomIcon from '@mui/icons-material/Room'
import L from 'leaflet'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye'
delete L.Icon.Default.prototype._getIconUrl
import GpsFixedIcon from '@mui/icons-material/GpsFixed'

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

import MapIcon from '@mui/icons-material/Map'
import 'leaflet/dist/leaflet.css'
import { instanceAxios } from '../../config/api'
import { useDispatch } from 'react-redux'

function MapController({ markers }) {
  const map = useMap()

  useEffect(() => {
    const container = map.getContainer()

    const fitToMarkers = () => {
      if (markers.length > 0) {
        const bounds = markers.map((marker) => [marker.latitude, marker.longitude])
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

export default function Area() {
  const {
    watch,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm()

  const dispatch = useDispatch()

  const [bairro, setBairro] = useState(null)
  const [cidade, setCidade] = useState('marituba')

  const [one, setOne] = useState(true)
  const [zones, setZones] = useState([])

  const [local, setLocal] = useState(null)
  const [load, setLoad] = useState(false)

  const [spinner, setSpinner] = useState(false)

  const modalVisible = useRef()

  const [filterZone, setFilterZone] = useState({
    name: '',
    district: '',
    city: '',
  })
  const CloseAdd = () => {
    reset({})
  }
  const submit = async (input) => {
    const res = await instanceAxios.post('/zone/create', input)

    if (res.status == 200) {
      modalVisible.current.visibleModal()
      dispatch({
        type: 'set',
        alert: {
          title: 'Área',

          visible: true,
          color: 'success',
          message: res.data.message,
        },
      })

      setZones((zone) => [...zones, res.data.zone])

      reset({})
      setBairro('')
      setCidade('')
    } else {
      dispatch({
        type: 'set',
        alert: {
          title: 'Área',
          visible: true,
          color: 'error',
          message: 'Erro ao criar área',
        },
      })
    }
  }

  const handleButtonSalveModal = () => {
    document.getElementById('submitbtn').click()
  }

  const [visibleCollapse, setVisibleCollapse] = useState(false)

  const deleteZone = async (id) => {
    const res = await instanceAxios.delete(`/zone/${id}`)

    if (res.status == 200) {
      setZones((prev) => prev.filter((zone) => zone.id !== id))

      dispatch({
        type: 'set',
        alert: {
          title: 'Área',

          visible: true,
          color: 'success',
          message: res.data.message,
        },
      })
    }
  }

  const api = async () => {
    setSpinner(true)
    const zones = await instanceAxios.get('/zone')
    if (zones.status == 200) {
      setSpinner(false)
      setZones(zones.data)
    }
  }

  const zones_filtes = zones.filter((item) => {
    return (
      (item.name || '').toUpperCase().includes((filterZone.name || '').toUpperCase()) &&
      (item.district || '').toUpperCase().includes((filterZone.district || '').toUpperCase()) &&
      (item.city || '').toUpperCase().includes((filterZone.city || '').toUpperCase())
    )
  })

  useEffect(() => {
    if (one) {
      api()
      setOne(false)
    }

    if (!bairro || !cidade) {
      setValue('latitude', '')
      setValue('longitude', '')
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
                  <strong>{zones.length}</strong>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-3">
        <CCol>
          <CCard>
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <h6 className="text-uppercase ">Mapa de distribuição de áreas</h6>
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
              <CRow>
                <CCol>
                  <CCollapse visible={visibleCollapse}>
                    <MapContainer
                      // center={[local.latitude, local.longitude]}

                      style={{
                        height: '60vh',
                        width: '100%',
                      }}
                    >
                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {zones.map((maker, index) => (
                        <div key={index}>
                          <Circle
                            center={[maker.latitude, maker.longitude]}
                            radius={
                              Number.isFinite(Number(maker.citizens?.length)) ? Number(maker.citizens?.length) : 0
                            }
                            //radius={Number(maker.citizens?.length)}
                          />

                          {/* <Circle
                            pathOptions={{
                              color: 'red',
                            }}
                            center={[maker.latitude, maker.longitude]}
                            radius={maker.leaders?.length *100}
                          /> */}
                          <Marker key={index} position={[maker.latitude, maker.longitude]}>
                            <Tooltip>
                              <div className="p-2 text-uppercase">
                                <h6
                                  style={{
                                    fontSize: 14,
                                    fontWeight: 550,
                                  }}
                                >
                                  {maker.name}
                                </h6>
                                <p>Lideres Viculados: {maker.leaders?.length}</p>
                                <p>Cidadões Viculados: {maker.citizens?.length}</p>
                                <p>{maker.observation}</p>
                              </div>
                            </Tooltip>
                          </Marker>
                        </div>
                      ))}

                      <MapController markers={zones} />
                      {/* <ResizeMap /> */}
                    </MapContainer>
                  </CCollapse>
                </CCol>
              </CRow>
            </CardBody>
          </CCard>
        </CCol>
      </CRow>

      <CRow className="mt-3">
        <CCol>
          <CCard>
            <CCardHeader>
              <CRow>
                <CCol>
                  <h6 className="text-uppercase">Áreas Registradas</h6>
                </CCol>
              </CRow>
              <CRow className="mt-3" xs={{ cols: 1 }} md={{ cols: 4 }}>
                <CCol>
                  <CInputGroup>
                    <CInputGroupText>Nome</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={filterZone.name}
                      onChange={(e) => {
                        setFilterZone({ ...filterZone, name: e.target.value })
                      }}
                    />
                  </CInputGroup>
                </CCol>

                <CCol className="mt-md-0 mt-3">
                  <CInputGroup>
                    <CInputGroupText>Bairro</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={filterZone.district}
                      onChange={(e) => {
                        setFilterZone({ ...filterZone, district: e.target.value })
                      }}
                    />
                  </CInputGroup>
                </CCol>

                <CCol className="mt-md-0 mt-3">
                  <CInputGroup>
                    <CInputGroupText>Cidade</CInputGroupText>
                    <CFormInput
                      type="text"
                      value={filterZone.city}
                      onChange={(e) => {
                        setFilterZone({ ...filterZone, city: e.target.value })
                      }}
                    />
                  </CInputGroup>
                </CCol>

                <CCol className="mt-md-0 mt-3">
                  <CInputGroup>
                    <CButton
                      color="primary"
                      variant="outline"
                      onClick={() => {
                        setFilterZone({
                          name: '',
                          district: '',
                          city: '',
                        })
                      }}
                    >
                      limpar filtros
                    </CButton>
                  </CInputGroup>
                </CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CTable responsive className="mt-3">
                    <CTableHead>
                      <CTableHeaderCell className="text-center">Nome</CTableHeaderCell>
                      <CTableHeaderCell>Bairro</CTableHeaderCell>
                      <CTableHeaderCell>Cidade</CTableHeaderCell>
                      <CTableHeaderCell>Localização</CTableHeaderCell>
                      <CTableHeaderCell>Observação</CTableHeaderCell>

                      <CTableHeaderCell>Ação</CTableHeaderCell>
                    </CTableHead>
                    <CTableBody className="text-uppercase">
                      {spinner ? (
                        <CTableRow>
                          <CTableDataCell colSpan={6}>
                            <div className="d-flex justify-content-center">
                              <CSpinner />
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        zones_filtes.map((zone) => (
                          <CTableRow>
                            <CTableDataCell>
                              <div className="d-flex gap-3 align-items-center">
                                <GpsFixedIcon
                                  sx={{
                                    fontSize: 30,
                                  }}
                                />
                                <span>{zone.name}</span>
                              </div>
                            </CTableDataCell>
                            <CTableDataCell>{zone.district}</CTableDataCell>
                            <CTableDataCell>{zone.city}</CTableDataCell>
                            <CTableDataCell>
                              <CBadge
                                color="info"
                                as={'a'}
                                href={`https://www.google.com/maps?q=${zone.latitude},${zone.longitude}`}
                                target="_blank"
                              >
                                <RoomIcon />
                                <span
                                  style={{
                                    fontSize: 13,
                                  }}
                                >
                                  Área
                                </span>
                              </CBadge>
                            </CTableDataCell>
                            <CTableDataCell>{zone.observation}</CTableDataCell>
                            <CTableDataCell>
                              <CDropdown>
                                <CDropdownToggle>
                                  <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />
                                </CDropdownToggle>
                                <CDropdownMenu>
                                  <CDropdownItem
                                    onClick={() => {
                                      deleteZone(zone.id)
                                    }}
                                  >
                                    <DeleteIcon className="me-2" />
                                    Excluir
                                  </CDropdownItem>
                                  <CDropdownItem>
                                    <EditIcon className="me-2" />
                                    Editar
                                  </CDropdownItem>
                                </CDropdownMenu>
                              </CDropdown>
                            </CTableDataCell>
                          </CTableRow>
                        ))
                      )}
                    </CTableBody>
                  </CTable>
                </CCol>
              </CRow>
            </CCardBody>
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
              <CFormInput label="Nome" {...register('name', { required: true })} />
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
                  {...register('district', {
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
                  {...register('city', {
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
                <CInputGroupText>latitude</CInputGroupText>
                <CFormInput {...register('latitude')} readOnly />
              </CInputGroup>
            </CCol>

            <CCol>
              <CInputGroup>
                <CInputGroupText>longitude</CInputGroupText>
                <CFormInput {...register('longitude')} readOnly />
              </CInputGroup>
            </CCol>
          </CRow>

          {/* <CRow className="mt-3">
            <CCol>
              <CInputGroup>
                <CInputGroupText>Link</CInputGroupText>
                <CFormInput
                  readOnly
                  placeholder="localização"
                  value={linkLocalizacao}
                  {...register('link')}
                />
                <CButton color="primary" variant="outline">
                  <ContentCopyIcon />
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow> */}

          <CRow className="mt-3">
            <CCol>
              <CFormTextarea label="observação" {...register('observation')} />
            </CCol>
          </CRow>

          <input type="submit" hidden id="submitbtn" />
        </CForm>
      </ModalDash>
    </CContainer>
  )
}
