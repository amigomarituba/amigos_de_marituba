import React, { useEffect, useState } from "react"
import { cilOptions } from "@coreui/icons"
import CIcon from "@coreui/icons-react"
import { Box, Menu, MenuItem, Button } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import ContentPasteOffIcon from '@mui/icons-material/ContentPasteOff';
import DoNotDisturbAltIcon from '@mui/icons-material/DoNotDisturbAlt';
import { CBadge, CButton, CCollapse, CFormLabel, CFormTextarea, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle, CPopover } from "@coreui/react";
import { formatDate } from "../../../../utils/Utils";
import { fomartCPF, handleFomartPhone } from "../../../regencia/Cards/Utils/FormatInput";
import { number } from "prop-types";


const CardAgendamento = ({ data, deleteAgendamento, confimeAgendamento, regulacao }) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [colorBorderService, setBorderService] = useState()
    const [confim, setConfim] = useState(false)
    const [colorBadge, setColorBadge] = useState('')
    const [colorRegulacao, setColorRegulacao] = useState('primary')
    const [colorMenuRender, setColorMenuRender] = useState('danger')
    const [visibleCollapse, setvisibleColapse] = useState(false)

    const [visible, setVisible] = useState(false)
    const [textArea, setTextArea] = useState('')

    const [menuDateResender, setMenuDateResender] = useState(true)

    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(false);
    };

    const handleCollapse = () => {
        setvisibleColapse(!visibleCollapse)

    }

    const handleMenuConfim = () => {
        confimeAgendamento({ id: data.id, type: 'pres', value: true, obs: '' })
        handleClose()
    }

    const handleMenuRegulacao = () => {
        setVisible(true)
        handleClose()
    }

    const handleMenuRegulacaoRemover = () => {
        regulacao({ id: data.id, type: 'regu', value: false, obs: '' })
        handleClose()
    }

    const handleMenuDelete = () => {
        deleteAgendamento(data)
        handleClose()
    }

    const validacaoDiaAgendamento = (data) =>{
        const data_atual = formatDate(new Date())

        const [diaAtual,mesAtual,anoAtual] = data_atual.split('/')

        const [diaAgend,mesAgend,anoAgend] = data.date_string.split('/')

        if (Number(anoAgend) < Number(anoAtual))
            setMenuDateResender(false)
        else {
            if (Number(mesAgend) < Number(mesAtual)){
                setMenuDateResender(false)
            }else {
                if(Number(diaAgend) < Number(diaAtual)){
                    setMenuDateResender(false)
                }
            }
        }
    }

    useEffect(() => {

        validacaoDiaAgendamento(data)
        
        if (data.presence) {
            setBorderService('border-start-success border-success')
            setColorBadge('success')

        } else {
            setBorderService('border-start-secondary')
            setColorBadge('secondary')
        }
    }, [confim])

    const TitleInfo = ({ title, value, sx, st }) => {
        return (
            <Box sx={{ display: 'flex', gap: 1, fontStyle: 'italic', fontSize: 13, marginBottom: '3px', ...sx }}>
                <span style={{ ...st }}>{title}</span>{value}
            </Box>
        )
    }

    const textAreaObservacao = (e) => { setTextArea(e.target.value); }

    const handleCloseModal = () => {
        setVisible(false)
    }

    const handleSaveModal = () => {

        regulacao({ id: data.id, type: 'regu', value: true, obs: textArea })
        handleCloseModal()
    }

    return (
        <Box>

            <CModal
                visible={visible}
                size='md'
                onClose={() => { setVisible(false) }}
            >

                <CModalHeader>
                    <ContentPasteIcon style={{ width: "7%", marginRight: 10 }} />

                    <CModalTitle>Regulação</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <form>
                        <Box>
                            <CFormLabel style={{ padding: 2, fontWeight: 'bold' }}>
                                Observaçôes
                            </CFormLabel>

                            <Box display={'flex'} gap={1}>
                                <Box sx={{
                                    width: '100%'
                                }} >

                                    <CFormTextarea
                                        id="exampleFormControlTextarea1"
                                        rows={3}
                                        onChangeCapture={textAreaObservacao}
                                    ></CFormTextarea>
                                </Box>
                            </Box>
                        </Box>

                    </form>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary"
                        onClick={handleCloseModal}>Cancelar</CButton>
                    <CButton color="primary"
                        onClick={handleSaveModal}> Salvar </CButton>
                </CModalFooter>
            </CModal>

            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                {
                    menuDateResender ? (
                        <>
                            <MenuItem onClick={handleMenuConfim}>
                                <CheckCircleIcon sx={{ marginRight: 1 }} />
                                Presente
                            </MenuItem>
                            <MenuItem onClick={handleMenuDelete}>
                                <DeleteIcon sx={{ marginRight: 1 }} />
                                Deletar
                            </MenuItem>
                        </>

                    ):''
                }
                {
                    data.regulation ? (
                        <MenuItem onClick={handleMenuRegulacaoRemover}>
                            <ContentPasteOffIcon sx={{ marginRight: 1 }} />
                            Sem Regulação
                        </MenuItem>
                    ) : (
                        <MenuItem onClick={handleMenuRegulacao}>
                            <ContentPasteIcon sx={{ marginRight: 1 }} />
                            Regulação
                        </MenuItem>
                    )
                }

                
            </Menu>


            <Box className={`w-100 mb-3 border rounded p-3 border-start border-start-5 ${colorBorderService}`}>
                <Box sx={{ display: 'flex', width: "100%", height: 'auto' }}>

                    <Box onClick={handleCollapse} sx={{ cursor: 'pointer', display: 'flex', width: '100%', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>

                        <Box sx={{ display: 'flex', fontWeight: 900, justifyContent: 'space-between', width: '100%', }}>

                            <Box>
                                <span style={{ fontSize: 20 }}>{data.name}</span>
                            </Box>

                            <Box sx={{ gap: 1, display: 'flex' }}>
                                <span >
                                    <CBadge color={colorBadge} style={{ fontSize: 16 }}>{data.service}</CBadge>
                                </span>
                                {
                                    data.regulation ? (
                                        <span >
                                            <CPopover content='Serviço com regulação' placement="top" trigger={['hover', 'focus']}>
                                                <CBadge color={colorRegulacao} sx={{ marginLeft: 1 }}>
                                                    <ContentPasteIcon sx={{ fontSize: 20 }} />
                                                </CBadge>
                                            </CPopover>
                                        </span>
                                    ) :
                                        ''
                                }


                                {
                                    !menuDateResender ? (
                                        <span >
                                            <CPopover content='Não e possível delete ou marca presença em agendamentos passados' placement="top" trigger={['hover', 'focus']}>
                                                <CBadge color={colorMenuRender} sx={{ marginLeft: 1 }}>
                                                    <DoNotDisturbAltIcon sx={{ fontSize: 20 }} />
                                                </CBadge>
                                            </CPopover>
                                        </span>
                                    ) :
                                        ''
                                }
                            </Box>

                        </Box>

                        <Box>
                            <span style={{ fontSize: 14 }} >{handleFomartPhone(data.contact)}</span>
                        </Box>

                        {/* <Box sx={{display:'flex', gap:5,fontWeight:500, justifyContent:'space-between', width:'100%', marginBottom:1, fontSize:18}}>
                            <span>Serviço</span>
                            <span></span>
                        </Box> */}

                        <CCollapse visible={visibleCollapse}>


                            <Box sx={{
                                display: 'flex',
                                flexDirection: 'row',
                                gap: 3,
                                marginTop: 2
                            }}>

                                <TitleInfo
                                    title={'CPF: '}
                                    value={fomartCPF(data.cpf)}
                                    sx={{
                                        fontWeight: 500
                                    }}
                                />

                                <TitleInfo
                                    title={'D.N: '}
                                    value={formatDate(data.birth)}
                                    sx={{
                                        fontWeight: 500
                                    }}
                                />
                            </Box>



                            <TitleInfo
                                title={'Lider: '}
                                value={data.leader}
                                sx={{
                                    fontWeight: 500
                                }}
                            />



                            {
                                data.observation_regulation != '' ? (
                                    <TitleInfo
                                        title={'Regulação: '}
                                        value={data.observation_regulation}

                                        sx={{
                                            fontWeight: 500,
                                        }}
                                    />
                                ) : ''
                            }

                            {
                                data.observation != '' ?
                                    (
                                        <TitleInfo
                                            title={'Observação: '}
                                            value={data.observation}

                                            sx={{
                                                fontWeight: 500,
                                            }}
                                        />
                                    ) : ''
                            }



                            <TitleInfo
                                title={'Agendado por:'}
                                value={`${data.registry_name} em ${formatDate(data.createdAt)}`}
                                sx={{
                                    color: '#fff8',
                                }}
                            />

                        </CCollapse>
                    </Box>

                    <Box sx={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                        <Button
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleClick}
                        >
                            <CIcon icon={cilOptions} size="lg" aria-haspopup="true" />

                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default React.memo(CardAgendamento)
