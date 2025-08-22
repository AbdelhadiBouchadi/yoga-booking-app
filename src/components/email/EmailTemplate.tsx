import React from "react";
import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
} from "@react-email/components";

interface EmailTemplateProps {
  firstName: string;
  otp: string;
}

const main = {
  backgroundColor: "#f3f4f1", // --background converted to hex
  fontFamily:
    'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "20px",
  width: "100%",
  maxWidth: "600px",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#6b8f3f", // --primary converted to hex
  borderRadius: "8px 8px 0 0",
  padding: "32px 24px",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "28px",
  fontWeight: "600",
  margin: "0",
  lineHeight: "1.2",
};

const headerSubtitle = {
  color: "#e8f4e8",
  fontSize: "16px",
  margin: "8px 0 0 0",
  fontWeight: "400",
};

const content = {
  padding: "32px 24px",
};

const iconContainer = {
  width: "80px",
  height: "80px",
  backgroundColor: "#f0f7eb",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px",
  border: "2px solid #6b8f3f",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#2d3a1f", // --foreground converted to hex
  margin: "0 0 24px 0",
  lineHeight: "1.4",
};

const description = {
  color: "#4a5d32",
  fontSize: "16px",
  lineHeight: "1.6",
  margin: "0 0 32px 0",
  textAlign: "center" as const,
};

const otpContainer = {
  backgroundColor: "#f0f7eb",
  border: "2px solid #6b8f3f",
  borderRadius: "12px",
  padding: "32px 24px",
  textAlign: "center" as const,
  margin: "0 0 32px 0",
};

const otpLabel = {
  color: "#4a5d32",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const otpCodeBox = {
  backgroundColor: "#ffffff",
  border: "2px solid #6b8f3f",
  borderRadius: "8px",
  padding: "20px",
  margin: "0 auto",
  display: "inline-block",
  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
};

const otpCode = {
  color: "#6b8f3f",
  fontSize: "32px",
  fontWeight: "700",
  letterSpacing: "8px",
  fontFamily: 'Monaco, "Lucida Console", monospace',
  margin: "0",
};

const warningBox = {
  backgroundColor: "#fff7ed",
  border: "1px solid #d97642",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "0 0 32px 0",
};

const warningText = {
  color: "#b8652f",
  fontSize: "14px",
  margin: "0",
  lineHeight: "1.5",
};

const supportSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const supportText = {
  color: "#6b7d5a",
  fontSize: "14px",
  lineHeight: "1.6",
  margin: "0 0 16px 0",
};

const supportButton = {
  color: "#6b8f3f",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  padding: "8px 16px",
  border: "1px solid #6b8f3f",
  borderRadius: "6px",
  display: "inline-block",
  backgroundColor: "#ffffff",
};

const footer = {
  borderTop: "1px solid #e5e7e4",
  padding: "24px 24px 16px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#6b7d5a", // --muted-foreground converted
  margin: "0 0 8px 0",
  lineHeight: "1.4",
};

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  firstName,
  otp,
}) => (
  <Html>
    <Head>
      <Font
        fontFamily="system-ui"
        fallbackFontFamily="sans-serif"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
    </Head>
    <Preview>
      Welcome to La Fabrique Du Bonheur! Verify your email to begin your
      wellness journey
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>La Fabrique Du Bonheur</Heading>
          <Text style={headerSubtitle}>Your wellness journey begins here</Text>
        </Section>

        <Section style={content}>
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={iconContainer}>
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6b8f3f"
                strokeWidth="2"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>

            <Text style={greeting}>Namaste {firstName},</Text>

            <Text style={description}>
              Welcome to La Fabrique Du Bonheur! We're excited to have you join
              our wellness community. Please use the verification code below to
              confirm your email address and begin your journey with us.
            </Text>
          </div>

          <div style={otpContainer}>
            <Text style={otpLabel}>Your Verification Code</Text>

            <div style={otpCodeBox}>
              <Text style={otpCode}>{otp}</Text>
            </div>
          </div>

          <div style={warningBox}>
            <Text style={warningText}>
              <strong>Mindful Security:</strong> Never share this code with
              anyone. La Fabrique Du Bonheur will never ask for your
              verification code via phone or email. Keep your practice and your
              account secure.
            </Text>
          </div>

          <div style={supportSection}>
            <Text style={supportText}>
              If you didn't create an account with us, please ignore this email
              or contact our wellness support team for assistance.
            </Text>

            <a
              href="mailto:contact@lafabriquedubonheur.co"
              style={supportButton}
            >
              Contact Support
            </a>
          </div>

          <Text
            style={{
              fontSize: "14px",
              color: "#4a5d32",
              lineHeight: "1.6",
              margin: "32px 0 0 0",
              textAlign: "center",
            }}
          >
            <strong>What's next?</strong>
            <br />
            • Complete your profile setup
            <br />
            • Browse our workshops
            <br />• Book your first class and begin your journey
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            This email was sent to verify your account with La Fabrique Du
            Bonheur. If you have any questions about our yoga classes or
            wellness programs, please don't hesitate to reach out.
          </Text>
          <Hr
            style={{
              border: "none",
              borderTop: "1px solid #e5e7e4",
              margin: "16px 0",
            }}
          />
          <Text style={footerText}>
            &copy; {new Date().getFullYear()} La Fabrique Du Bonheur - Creating
            happiness through wellness
            <br />
            This is an automated email, please do not reply directly.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
