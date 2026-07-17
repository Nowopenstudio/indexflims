import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface BaseEmailProps {
  preview?: string
  heading?: string
  body?: string
}

export default function BaseEmail({
  preview = 'index',
  heading = 'Hello',
  body = '',
}: BaseEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading style={{ fontSize: '24px', color: '#111' }}>{heading}</Heading>
          <Text style={{ fontSize: '16px', color: '#444', lineHeight: '1.6' }}>{body}</Text>
        </Container>
      </Body>
    </Html>
  )
}
