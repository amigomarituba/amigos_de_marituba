// import React, { useEffect, useRef, useState } from 'react'
// import ModalDash from '../../components/Modal/ModalDash'
// import { cilTerrain } from '@coreui/icons'
// import { CCol, CFormInput, CFormSelect } from '@coreui/react'
// import HeaderSeach from '../../components/header/HeaderSeach'
// import CardArea from './Cards/CardArea'
// import ListView from '../../components/ListView/ListView'
// import { useForm } from 'react-hook-form'
// import { instanceAxios } from '../../config/api'
// import AlertRegistre from '../../components/AlertRegistre/AlertRegistre'

// const Area = () => {
//   const { register, handleSubmit, reset } = useForm()
//   const [create, setCreate] = useState(false)

//   const [listAreas, setListAreas] = useState([])

//   const modalVisible = useRef()

//   const [alertOpen , setAlertOpen ] = useState(false);
//   const [alertErro , setAlertErro ] = useState(false);


//   useEffect(() => { api() }, [create])

//   const api = async () =>{

//     const { data } = await instanceAxios.get('/zone')

//     setListAreas(data)

//   }

//   const handleButtonSalveModal = () => {
//     document.getElementById('submitbtn').click()
//   }

//   const handleEditer = (areaID) => {  
//     areaID.edite = true
//     reset(areaID)
//     modalVisible.current.visibleModal();
//   }

//   const handleDelete = async (areaID) => {
//     const { data } = await instanceAxios.delete(`/zone/${areaID}`)
//     setCreate(!create)
//   }

//   const fillterCallback =async (filter)=>{
//     const { data } = await instanceAxios.get('/zone/show',{
//       params:filter
//     })
//     setListAreas(data) 
//   }

//   const onSubmit = async (areaData) => {

//     let status = 0;

//     if(areaData.edite){
//       try{
//         delete areaData.edite
//         const {data}  = await instanceAxios.post('/zone/update',areaData)
//         setAlertOpen(true)
        
//       }catch{
//         setAlertErro(true)
        
//       }
      
//     }else {
//       try {
//         status = await instanceAxios.post('/zone/create', areaData)
//         setAlertOpen(true)
        
//       } catch (error) {
//         setAlertErro(true)
        
//       }  
//     }
//     reset()
//     modalVisible.current.visibleModal()
//     setCreate(!create)

//   }

//   const handleClose = () => {
//     setAlertOpen(false)
//     setAlertErro(false)
//   };

//   const CloseAdd = () =>{
//     reset({})
//   } 

//   return (
//     <>
//       <AlertRegistre open={alertOpen} handleClose={handleClose} 
//       severity={'success'} message={'Registrado com Sucesso!'} />

//       <AlertRegistre open={alertErro} handleClose={handleClose} 
//       severity={'error'} message={'Erro no Salvento do Registro'} />

//       <HeaderSeach placeholder={'Buscar área'} fillterCallback={fillterCallback} select={[
//         {
//           name:'type',
//           nameLabel:'Tipo',
//           labels: [
//             { label: 'bairro', value: 'bairro' },
//             { label: 'conjunto', value: 'conjunto' }
//           ]
//         }
//       ]}
//       />

//       <ListView>
//         {

//           listAreas.map((data) => {
//             return (
//               <CardArea 
//               key={data.codigo} 
//               data={data} 
//               editerArea={handleEditer} 
//               deleteArea={handleDelete}
//               />
//             )
//           })

//         }
//       </ListView>

//       <ModalDash
//         title={"Resgitra/Atualizar Área"}
//         icon={cilTerrain}
//         handleButtonSalveModal={handleButtonSalveModal}
//         ref={modalVisible}
//         CloseAdd={CloseAdd}
//       >

//         <CCol>
//           <form onSubmit={handleSubmit(onSubmit)}>

//             <CFormInput
//               {...register('zone')}
//               type="text"
              
//               floatingClassName="mb-3"
//               floatingLabel="Nome da Area"
//               placeholder="bairro ou conjunto"

//             />
//             <CFormSelect
//               {...register('type')}
              
//               floatingLabel="Tipo"
//               aria-label="Floating label select example"

//             >
//               <option>tipo de área</option>
//               <option value="bairro">Bairro</option>
//               <option value="conjunto">Conjunto</option>

//             </CFormSelect>
//             <input type='submit' hidden id='submitbtn' />
//           </form>

//         </CCol>

//       </ModalDash>
//     </>
//   )
// }

// export default Area
