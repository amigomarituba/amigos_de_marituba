import { Route, Routes } from 'react-router-dom'
import DefaultLayout from '../layout/DefaultLayout'
import Page404 from '../views/pages/page404/Page404'


function AppRoute() {
    return (
        <Routes>
            <Route path="*" name="Dashboard" element={<DefaultLayout />}/>
        </Routes>
    )
}

export { AppRoute }