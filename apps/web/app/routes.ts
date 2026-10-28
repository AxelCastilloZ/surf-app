import { type RouteConfig, route } from '@react-router/dev/routes'

export default [
  // Landing page (ES / EN)
  route('/', 'routes/home.tsx', { id: 'home-es' }),
  route('/en', 'routes/home.tsx', { id: 'home-en' }),

  // Gallery
  route('/galeria', 'routes/gallery.tsx', { id: 'gallery-es' }),
  route('/en/gallery', 'routes/gallery.tsx', { id: 'gallery-en' }),

  // Booking
  route('/reservar', 'routes/booking.tsx', { id: 'booking-es' }),
  route('/en/book', 'routes/booking.tsx', { id: 'booking-en' }),

  // Confirm booking
  route('/confirmar-reserva/:token', 'routes/confirm-booking.tsx', { id: 'confirm-es' }),
  route('/en/confirm-booking/:token', 'routes/confirm-booking.tsx', { id: 'confirm-en' }),

  // Instructor profiles
  route('/instructores/:id', 'routes/instructor-profile.tsx', { id: 'instructor-es' }),
  route('/en/instructors/:id', 'routes/instructor-profile.tsx', { id: 'instructor-en' }),

  // Policies
  route('/politicas', 'routes/policies.tsx', { id: 'policies-es' }),
  route('/en/policies', 'routes/policies.tsx', { id: 'policies-en' }),

  // FAQ
  route('/preguntas-frecuentes', 'routes/faq.tsx', { id: 'faq-es' }),
  route('/en/faq', 'routes/faq.tsx', { id: 'faq-en' }),

  // Blog list
  route('/blog', 'routes/blog-list.tsx', { id: 'blog-list-es' }),
  route('/en/blog', 'routes/blog-list.tsx', { id: 'blog-list-en' }),

  // Blog post
  route('/blog/:slug', 'routes/blog-post.tsx', { id: 'blog-post-es' }),
  route('/en/blog/:slug', 'routes/blog-post.tsx', { id: 'blog-post-en' }),

  // Catch-all 404
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig
