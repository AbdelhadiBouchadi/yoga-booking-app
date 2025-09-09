import type React from "react";
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
  Button,
} from "@react-email/components";

interface BookingConfirmationTemplateProps {
  firstName: string;
  lessonTitle: string;
  lessonDate: string;
  lessonTime: string;
  location: string;
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

const greeting = {
  fontSize: "18px",
  fontWeight: "500",
  color: "#2d3a1f", // --foreground converted to hex
  margin: "0 0 24px 0",
  lineHeight: "1.4",
};

const confirmationBox = {
  backgroundColor: "#f0f7eb",
  border: "2px solid #6b8f3f",
  borderRadius: "8px",
  padding: "24px",
  margin: "24px 0",
};

const confirmationTitle = {
  color: "#6b8f3f",
  fontSize: "20px",
  fontWeight: "600",
  margin: "0 0 16px 0",
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

const warningBox = {
  backgroundColor: "#fef7f0",
  border: "1px solid #d97642", // --secondary converted
  borderRadius: "6px",
  padding: "16px",
  margin: "24px 0",
};

const warningText = {
  fontSize: "14px",
  color: "#b8652f",
  margin: "0",
  lineHeight: "1.5",
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

export const BookingConfirmationTemplate: React.FC<
  BookingConfirmationTemplateProps
> = ({
  firstName,
  lessonTitle,
  lessonDate,
  lessonTime,
  location,
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
      Your workshop is confirmed! We can't wait to see you there ✨
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={headerTitle}>La Fabrique Du Bonheur</Heading>
          <Text style={headerSubtitle}>Your inner journey continues</Text>
        </Section>

        <Section style={content}>
          <Text style={greeting}>Hello {firstName},</Text>

          <div style={confirmationBox}>
            <Heading style={confirmationTitle}>✨ Booking Confirmed ✨</Heading>
            <Text
              style={{
                fontSize: "16px",
                color: "#2d3a1f",
                textAlign: "center",
                margin: "0",
                lineHeight: "1.5",
              }}
            >
              Your spot is secured! We can't wait to see you there.
            </Text>
          </div>

          <div style={detailRow}>
            <Text style={detailLabel}>Workshop:</Text>
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

          <div style={warningBox}>
            <Text style={warningText}>
              <strong>Cancellation Policy:</strong> Please cancel at least 24
              hours before your workshop to avoid charges and allow others to
              join from the waitlist.
            </Text>
          </div>

          <Button style={ctaButton} href="https://lafabriquedubonheur.co/">
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
            <strong>What to bring:</strong>
            <br />• Any materials specified for your workshop
            <br />• Comfortable clothing appropriate for the activity
            <br />• A water bottle to stay hydrated
            <br />• An open mind and positive energy 🌟
            <br />• Your participation fee
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
