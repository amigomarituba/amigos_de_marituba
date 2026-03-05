import { Suspense } from 'react'
import { AppContent, AppSidebar, AppHeader } from '../components/index'
import { CSpinner } from '@coreui/react'
const DefaultLayout = () => {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          <Suspense
            fallback={
              <div className="pt-3 text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
            }
          >
            <AppContent />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
