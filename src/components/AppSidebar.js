import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarHeader,
  CImage
} from '@coreui/react'

import { AppSidebarNav } from './AppSidebarNav'

// sidebar nav config
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  const sidebarShow = useSelector((state) => state.sidebarShow)



  return (
    <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={true}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >
      <CSidebarHeader className="border-bottom">

      
        <CSidebarBrand to="/">
          <CImage fluid src={'/api/logo.png'} width={60} height={60}/>
          {/* <CIcon customClassName="sidebar-brand-full" height={32} />
          <CIcon customClassName="sidebar-brand-narrow"  height={32} /> */}
        </CSidebarBrand>

        {/* Botão close */}
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>

      {/* Botões de navegação */}
      <AppSidebarNav items={navigation} />

      {/* footer do conteudo */}
      {/* <CSidebarFooter className="border-top d-none d-lg-flex">
       
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter> */}

    </CSidebar>
  )
}

export default React.memo(AppSidebar)
