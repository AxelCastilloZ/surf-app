import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const LandingPage  = lazy(() => import('./pages/LandingPage'))
const GalleryPage  = lazy(() => import('./pages/GalleryPage'))
const PoliciesPage = lazy(() => import('./pages/PoliciesPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function PageLoader() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-ocean-600 border-t-transparent" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"            element={<LandingPage lang="es" />} />
          <Route path="/galeria"     element={<GalleryPage lang="es" />} />
          <Route path="/politicas"   element={<PoliciesPage lang="es" />} />
          <Route path="/en"          element={<LandingPage lang="en" />} />
          <Route path="/en/gallery"  element={<GalleryPage lang="en" />} />
          <Route path="/en/policies" element={<PoliciesPage lang="en" />} />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
