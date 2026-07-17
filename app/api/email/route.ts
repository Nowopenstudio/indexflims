import { resend } from '@/lib/resend/client'
import BaseEmail from '@/emails/BaseEmail'

export async function POST(req: Request) {
  const { to, subject, heading, body } = await req.json()

  const { data, error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!,
    to,
    subject,
    react: BaseEmail({ heading, body }),
  })

  if (error) {
    return Response.json({ error }, { status: 500 })
  }

  return Response.json({ data })
}
