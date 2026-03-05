import { CBadge, CButton, CCloseButton, CCol, CFormInput, CRow } from "@coreui/react"
import { Box } from "@mui/material"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { instanceAxios } from "../../../config/api"
import { useSelector } from "react-redux"

const Service = () => {
    const user = useSelector((state) => state.user)

    const { register, handleSubmit } = useForm()
    const [createService, setCreateService] = useState(false)
    const [services, setServices] = useState([])

    const onsubmit = async (data) => {
        const { status } = await instanceAxios.post('/service/create', data)
        setCreateService(!createService)
    }

    const handleRemoveService = async (id) => {
        const { status } = await instanceAxios.delete(`/service/${id}`)
        if (status == 200) {
            setCreateService(!createService)
        }
    }

    const api = async () => {
        const { status, data } = await instanceAxios.get('/service')

        if (status == 200) {
            setServices(data)
        }
    }

    useEffect(() => {
        api()

    }, [createService])

    return (
        <>
            <h4 className='mb-3'>Serviços</h4>
            <CCol>
                <CRow>
                    <h5>Novo Serviço</h5>
                </CRow>

                <form onSubmit={handleSubmit(onsubmit)}>


                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: 3
                    }}>
                        <Box sx={{
                            width: '15%'
                        }} >
                            <CFormInput
                                type="color"
                                id="nameArea"
                                style={{
                                    width: '100%'
                                }}
                                floatingClassName="mb-3"
                                floatingLabel="Cor"
                                placeholder="serviço"
                                {...register('color', { required: true })}
                            />

                        </Box>

                        <Box sx={{
                            width: '100%'
                        }}>

                            <CFormInput
                                type="text"
                                id="nameArea"
                                floatingClassName="mb-3"
                                floatingLabel="Novo Serviço"
                                placeholder="serviço"
                                {...register('service', { required: true })}
                            />

                        </Box>
                    </Box>

                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                    }}>
                        <Box sx={{
                            width: '50%'

                        }} >
                            <CButton type='submit' color='success' style={{ color: '#fff', width: '100%' }}>
                                Adicionar
                            </CButton>
                        </Box>
                    </Box>
                </form>

            </CCol>
            <CCol>
                <h5>Serviços</h5>
                <Box sx={{
                    display: 'grid',
                    gap: 3,
                    gridTemplateColumns: 'auto auto auto'
                }}>
                    {
                        services.map((service, index) => (
                            <CBadge key={index} style={{
                                fontSize: 18, backgroundColor: service.color,
                                display: 'flex',
                                justifyContent: 'space-between',

                            }}>
                                {service.service}
                                <CCloseButton style={{ marginLeft: 15, color: '#fff' }} onClick={() => handleRemoveService(service.id)} />
                            </CBadge>
                        ))
                    }
                </Box>
            </CCol>
        </>
    )
}

export default Service