import { createServiceClient, createAnonClient } from '../_shared/supabase.ts'
import { corsHeaders, handleCors } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    const anonClient = createAnonClient(authHeader)

    const { data: { user: caller } } = await anonClient.auth.getUser()
    if (!caller) {
      return new Response(JSON.stringify({ error: 'No autenticado' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: callerProfile } = await anonClient
      .from('dashboard_users')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (callerProfile?.role !== 'superadmin') {
      return new Response(JSON.stringify({ error: 'Solo superadmin puede crear usuarios' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { email, password, full_name, role } = await req.json()

    if (!email || !password || !full_name || !role) {
      return new Response(JSON.stringify({ error: 'Campos requeridos: email, password, full_name, role' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const serviceClient = createServiceClient()

    const { data: authData, error: authError } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    })

    if (authError) {
      return new Response(JSON.stringify({ error: authError.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { error: dbError } = await serviceClient
      .from('dashboard_users')
      .insert({
        id: authData.user.id,
        email: email.toLowerCase(),
        full_name,
        role,
        is_active: true,
        password_hash: '-- managed by supabase auth --',
      })

    if (dbError) {
      await serviceClient.auth.admin.deleteUser(authData.user.id)
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({
      data: {
        id: authData.user.id,
        email,
        full_name,
        role,
        is_active: true,
      },
      message: 'Usuario creado correctamente',
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
