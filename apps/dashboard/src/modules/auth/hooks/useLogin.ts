import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { login } from '../api/auth.api'
import { useAuthStore } from '@/core/store/authStore'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.user, data.access_token)
      navigate('/dashboard', { replace: true })
    },
  })
}
