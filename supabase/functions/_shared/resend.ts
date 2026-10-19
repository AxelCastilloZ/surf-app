const RESEND_API_URL = 'https://api.resend.com/emails'

interface SendEmailParams {
  to: string
  subject: string
  html: string
}

export async function sendEmail(params: SendEmailParams): Promise<void> {
  const apiKey = Deno.env.get('RESEND_API_KEY')
  const from = Deno.env.get('MAIL_FROM') ?? 'onboarding@resend.dev'

  if (!apiKey) {
    console.warn('RESEND_API_KEY not set — skipping email')
    return
  }

  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error(`Resend error: ${res.status} ${body}`)
  }
}

export function getStaffEmail(): string {
  return Deno.env.get('STAFF_NOTIFY_EMAIL') ?? ''
}

export function getWebUrl(): string {
  return Deno.env.get('WEB_URL') ?? 'https://surferlabscr.com'
}
