import React from "react";
import {
  Html,
  Head,
  Font,
  Preview,
  Body,
  Container,
  Section,
  Row,
  Column,
  Heading,
  Text,
  Button,
  Hr,
  Img,
} from "@react-email/components";

interface WaitlistNotificationTemplateProps {
  firstName: string;
  lessonTitle: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
  position: number;
  instructorName?: string;
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
  backgroundColor: "#d97642", // --secondary converted to hex
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
  color: "#f4e8e0",
  fontSize: "16px",
  margin: "8px 0 0 0",
  fontWeight: "400",
};

const content = {
  padding: "32px 24px",
};

const greeting = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#2d3a1f", // --foreground converted to hex
  margin: "0 0 24px 0",
  lineHeight: "1.4",
};

const waitlistBox = {
  backgroundColor: "#fff7ed",
  border: "2px solid #d97642",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const waitlistTitle = {
  color: "#d97642",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px 0",
  textAlign: "center" as const,
};

const positionBadge = {
  backgroundColor: "#d97642",
  color: "#ffffff",
  fontSize: "18px",
  fontWeight: "600",
  padding: "8px 16px",
  borderRadius: "20px",
  display: "inline-block",
  margin: "0 auto",
  textAlign: "center" as const,
};

const detailRow = {
  margin: "12px 0",
};

const detailLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#4a5d32", // slightly darker than foreground
  margin: "0",
  textAlign: "left" as const,
  width: "30%",
  display: "inline-block",
};

const detailValue = {
  fontSize: "14px",
  color: "#2d3a1f",
  margin: "0",
  fontWeight: "500",
  textAlign: "left" as const,
  width: "70%",
  display: "inline-block",
};

const infoBox = {
  backgroundColor: "#f0f7eb",
  border: "1px solid #6b8f3f",
  borderRadius: "6px",
  padding: "20px",
  margin: "24px 0",
};

const infoText = {
  fontSize: "14px",
  color: "#4a5d32",
  margin: "0 0 12px 0",
  lineHeight: "1.6",
};

const ctaButton = {
  backgroundColor: "#6b8f3f",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "14px 28px",
  margin: "24px 0",
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

export const WaitlistNotificationTemplate: React.FC<
  WaitlistNotificationTemplateProps
> = ({
  firstName,
  lessonTitle,
  lessonDate,
  lessonTime,
  location,
  position,
  instructorName,
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
      You're on the waitlist! We'll notify you if a spot opens up 🙏
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>La Fabrique Du Bonheur</Heading>
          <Text style={headerSubtitle}>Your wellness journey continues</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Namaste {firstName},</Text>

          <div style={waitlistBox}>
            <Heading style={waitlistTitle}>🙏 You're on the Waitlist</Heading>
            <div style={{ textAlign: "center", margin: "16px 0" }}>
              <span style={positionBadge}>Position #{position}</span>
            </div>
            <Text
              style={{
                fontSize: "16px",
                color: "#2d3a1f",
                textAlign: "center",
                margin: "16px 0 0 0",
                lineHeight: "1.5",
              }}
            >
              The class is currently full, but don't worry! We'll automatically
              notify you if a spot becomes available.
            </Text>
          </div>

          <div style={detailRow}>
            <Text style={detailLabel}>Session:</Text>
            <Text style={detailValue}>{lessonTitle}</Text>
          </div>

          <div style={detailRow}>
            <Text style={detailLabel}>Date:</Text>
            <Text style={detailValue}>{lessonDate}</Text>
          </div>

          <div style={detailRow}>
            <Text style={detailLabel}>Time:</Text>
            <Text style={detailValue}>{lessonTime}</Text>
          </div>

          <div style={detailRow}>
            <Text style={detailLabel}>Location:</Text>
            <Text style={detailValue}>{location}</Text>
          </div>

          {instructorName && (
            <div style={detailRow}>
              <Text style={detailLabel}>Instructor:</Text>
              <Text style={detailValue}>{instructorName}</Text>
            </div>
          )}

          <div style={infoBox}>
            <Text style={infoText}>
              <strong>How the waitlist works:</strong>
            </Text>
            <Text style={infoText}>
              • You'll receive an automatic email if a spot opens up
              <br />
              • Your position moves up as others cancel
              <br />
              • No payment required until you're confirmed
              <br />• You can cancel your waitlist position anytime
            </Text>
            <Text
              style={{ ...infoText, margin: "16px 0 0 0", fontWeight: "500" }}
            >
              Keep an eye on your inbox - spots often become available! ✨
            </Text>
          </div>

          <Button
            style={ctaButton}
            href="https://lafabriquedubonheur.co/bookings"
          >
            View My Bookings
          </Button>

          <Text
            style={{
              fontSize: "14px",
              color: "#4a5d32",
              lineHeight: "1.6",
              margin: "24px 0 0 0",
            }}
          >
            <strong>While you wait:</strong>
            <br />
            • Browse our other available classes
            <br />
            • Follow us on social media for wellness tips
            <br />
            • Practice some gentle stretches at home
            <br />• Remember: the right class will find you at the right time 🌸
          </Text>
        </Section>

        <Section style={footer}>
          <Text style={footerText}>
            Questions? Reply to this email or contact us at
            contact@lafabriquedubonheur.co
          </Text>
          <Text style={footerText}>
            La Fabrique Du Bonheur - Creating happiness through wellness
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);
