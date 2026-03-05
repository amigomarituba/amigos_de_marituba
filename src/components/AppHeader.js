import React, { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
  CBreadcrumb,
  CBreadcrumbItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'

import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'


const AppHeader = () => {
 const nameUser = useSelector((state) => state.user)
  
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  useEffect(() => {

    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="p-0" ref={headerRef} style={{marginBottom:17}}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          style={{ marginInlineStart: '-14px', flexDirection: 'row', display: 'flex', alignItems: 'center' }}
        >
          <CIcon icon={cilMenu} size="lg" onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })} style={{ marginRight: 20 }} />
          <CHeaderNav className="d-none d-md-flex">
            <CNavItem>
               {nameUser.user.level == 'adm'?<CNavLink to="/dashboard" as={NavLink}>Dashboard</CNavLink>:''
                }
            </CNavItem>

           
            <CNavItem>
              {nameUser.user.level == 'adm'?<CNavLink to="/settings" as={NavLink}>Configurações</CNavLink>:''}
            </CNavItem>

          </CHeaderNav>
        </CHeaderToggler>

        {/* <CHeaderNav>
          
        </CHeaderNav> */}

        <CHeaderNav>
          <AppHeaderDropdown nomeUser={nameUser} />
        </CHeaderNav>

      </CContainer>

      <CContainer style={{
        
        padding:5,
        
      }}>
      </CContainer>

      <CBreadcrumb style={{
        marginLeft:15, 
        textTransform:'uppercase', 
        fontStyle:'italic',
        fontSize:15,
      }}>
        Projeto Amigos de Marituba 
      </CBreadcrumb>


    </CHeader>
  )
}

export default AppHeader
