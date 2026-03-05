import { cilSearch } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CButton, CCol, CFormInput, CFormSelect, CInputGroup } from "@coreui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

const HeaderSeach = ({ placeholder, nameFiltro, select, fillterCallback, OnChangeArea}) => {


    const { register, handleSubmit, reset } = useForm()

    const onSubmit = (data) => {
        fillterCallback(data)

    }

    return (
        <CCol>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CInputGroup style={{
                    height:'50px'
                }} >
                    <CFormInput
                        {...register('input')}
                        placeholder={placeholder}
                        aria-label="Recipient's username"
                        aria-describedby="button-addon2"
                        style={{
                            textTransform:'uppercase'
                        }}
                    />
                    <CButton type="submit" color="secondary" variant="outline" style={{fontSize:15}} id="button-addon2" >
                        <CIcon icon={cilSearch} style={{ marginRight: 10 }} />
                        Buscar
                    </CButton>
                </CInputGroup>

                <CInputGroup style={{
                    alignItems: 'center',
                    gap: 10,
                    marginTop:10,
                    marginBottom:10
                }}>
                    <span>{nameFiltro}</span>

                    <div style={{ display: 'flex' }}>

                        {
                            select.map((label, index) => {
                                
                                
                                return (
                                    <CFormSelect

                                        onChangeCapture={OnChangeArea}
                                        

                                        {...register(label.name,{ required: true })}

                                        style={{
                                            width: 'auto',
                                            marginRight: 10
                                        }}
                                        aria-label="area"
                                      
                                        >
                                            {/* {
                                                label.nameLabel &&
                                                    <option value={''}>{label.nameLabel}</option>

                                            }
                                        {
                                            
                                            label.labels.map((area) =>
                                                

                                                <option value={area.uid}>{area.label} {area.zone} {area.name}</option>
                                            )
                                        } */}

                                    </CFormSelect>

                                )
                            })
                        }


                    </div>

                </CInputGroup>

            </form>
        </CCol>
    )
}

export default React.memo(HeaderSeach)