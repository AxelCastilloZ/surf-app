import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

const LandingPage        = lazy(() => import('./pages/LandingPage'))
const GalleryPage        = lazy(() => import('./pages/GalleryPage'))
const PoliciesPage       = lazy(() => import('./pages/PoliciesPage'))
const BookingFormPage    = lazy(() => import('./pages/BookingFormPage'))
const ConfirmBookingPage = lazy(() => import('./pages/ConfirmBookingPage'))
const InstructorProfilePage = lazy(() => import('./pages/InstructorProfilePage'))
const NotFoundPage       = lazy(() => import('./pages/NotFoundPage'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

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
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/"            element={<LandingPage lang="es" />} />
          <Route path="/galeria"     element={<GalleryPage lang="es" />} />
          <Route path="/politicas"   element={<PoliciesPage lang="es" />} />
          <Route path="/instructores/:id" element={<InstructorProfilePage lang="es" />} />
          <Route path="/reservar"    element={<BookingFormPage lang="es" />} />
          <Route path="/confirmar-reserva/:token" element={<ConfirmBookingPage lang="es" />} />
          <Route path="/en"          element={<LandingPage lang="en" />} />
          <Route path="/en/gallery"  element={<GalleryPage lang="en" />} />
          <Route path="/en/policies" element={<PoliciesPage lang="en" />} />
          <Route path="/en/instructors/:id" element={<InstructorProfilePage lang="en" />} />
          <Route path="/en/book"     element={<BookingFormPage lang="en" />} />
          <Route path="/en/confirm-booking/:token" element={<ConfirmBookingPage lang="en" />} />
          <Route path="*"            element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
