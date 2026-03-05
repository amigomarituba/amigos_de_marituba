import { Route, Routes } from 'react-router-dom'
import Login from '../views/pages/login/Login'
import React from 'react'
import Page404 from '../views/pages/page404/Page404'


function AuthRoute(params) {
    return(
        <Routes>
          <Route  path="/" name="Login Page" element={<Login />} />
          <Route exact path="*" name="Page 404" element={<Page404 />} />
          {/* <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
        </Routes>
    )
}

export {AuthRoute}