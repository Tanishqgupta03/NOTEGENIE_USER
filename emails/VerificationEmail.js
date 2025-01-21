import {
    Html,
    Head,
    Preview,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  export default function VerificationEmail({ username, otp }) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>Verification Code</title>
          {/* Custom fonts or other head content can go here */}
        </Head>
        <Preview>Your verification code: {otp}</Preview>
        <Section style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
          <Row>
            <Heading as="h2" style={{ color: '#333', marginBottom: '10px' }}>
              Hello, {username}
            </Heading>
          </Row>
          <Row>
            <Text style={{ fontSize: '16px', color: '#555' }}>
              Thank you for signing up! Please use the following OTP to verify your account:
            </Text>
          </Row>
          <Row>
            <Text
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                margin: '20px 0',
                textAlign: 'center',
                color: '#000',
              }}
            >
              {otp}
            </Text>
          </Row>
          <Row>
            <Text style={{ fontSize: '16px', color: '#555' }}>
              If you didn’t request this, please ignore this email or contact support.
            </Text>
          </Row>
          <Row>
            <Button
              href="https://yourapp.com/verify"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#007BFF',
                color: '#fff',
                textDecoration: 'none',
                borderRadius: '4px',
                marginTop: '20px',
              }}
            >
              Verify Now
            </Button>
          </Row>
        </Section>
      </Html>
    );
  }
  