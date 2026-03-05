import {
  CButton,
  CDropdown,
} from '@coreui/react'

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { instanceAxios } from '../../config/api';

const AppHeaderDropdown = ({nomeUser}) => {

  const userSession = useDispatch()
  const navi = useNavigate()

  const handleLogout = async ()=>{
    const user = await instanceAxios.delete('/session/delete')

    localStorage.removeItem('@user')
    userSession({ type: 'set',user:undefined})
    navi('/')
  }
  
  return (
    <CDropdown  style={{display:'flex'}}>
      <Box sx={{
        display:'flex',
        alignItems:'center',
        gap:1
      }}>
          { nomeUser.user.level =='adm'?
            <AdminPanelSettingsIcon sx={{
              color:'#36db5f'
            }}/> :
              <PersonIcon sx={{
              color:'#36db5f'
            }}/>
            }

        <h5 style={{
          margin:'0'
        }} > 
        Lider {nomeUser.user.leader_name}
        </h5>

        <CButton color="light" variant="ghost" onClick={handleLogout}>
          <LogoutIcon /> Sair
        </CButton>

      </Box>

    </CDropdown>
  )
}

export default AppHeaderDropdown
