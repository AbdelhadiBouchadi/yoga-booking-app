import { useTranslations } from "next-intl";

export function useBookingStatusFormatter() {
  const t = useTranslations("enums.bookingStatus");

  return (status: string) => {
    switch (status) {
      case "PENDING":
        return t("pending");
      case "CONFIRMED":
        return t("confirmed");
      case "CANCELLED":
        return t("cancelled");
      case "COMPLETED":
        return t("completed");
      case "NO_SHOW":
        return t("noShow");
      default:
        return status;
    }
  };
}

// Cancellation Reason formatter
export function useCancellationReasonFormatter() {
  const t = useTranslations("enums.cancellationReason");

  return (reason: string) => {
    switch (reason) {
      case "USER_CANCELLED":
        return t("userCancelled");
      case "INSTRUCTOR_CANCELLED":
        return t("instructorCancelled");
      case "LESSON_CANCELLED":
        return t("lessonCancelled");
      case "WEATHER":
        return t("weather");
      case "EMERGENCY":
        return t("emergency");
      case "OTHER":
        return t("other");
      default:
        return reason;
    }
  };
}

// Lesson Level formatter
export function useLessonLevelFormatter() {
  const t = useTranslations("enums.lessonLevel");

  return (level: string) => {
    switch (level) {
      case "Beginner":
        return t("beginner");
      case "Intermediate":
        return t("intermediate");
      case "Advanced":
        return t("advanced");
      default:
        return level;
    }
  };
}

// Non-hook versions for server components or when hooks can't be used
export function formatBookingStatus(
  status: string,
  t: (key: string) => string,
) {
  switch (status) {
    case "PENDING":
      return t("enums.bookingStatus.pending");
    case "CONFIRMED":
      return t("enums.bookingStatus.confirmed");
    case "CANCELLED":
      return t("enums.bookingStatus.cancelled");
    case "COMPLETED":
      return t("enums.bookingStatus.completed");
    case "NO_SHOW":
      return t("enums.bookingStatus.noShow");
    default:
      return status;
  }
}

export function formatCancellationReason(
  reason: string,
  t: (key: string) => string,
) {
  switch (reason) {
    case "USER_CANCELLED":
      return t("enums.cancellationReason.userCancelled");
    case "INSTRUCTOR_CANCELLED":
      return t("enums.cancellationReason.instructorCancelled");
    case "LESSON_CANCELLED":
      return t("enums.cancellationReason.lessonCancelled");
    case "WEATHER":
      return t("enums.cancellationReason.weather");
    case "EMERGENCY":
      return t("enums.cancellationReason.emergency");
    case "OTHER":
      return t("enums.cancellationReason.other");
    default:
      return reason;
  }
}

export function formatLessonLevel(level: string, t: (key: string) => string) {
  switch (level) {
    case "Beginner":
      return t("enums.lessonLevel.beginner");
    case "Intermediate":
      return t("enums.lessonLevel.intermediate");
    case "Advanced":
      return t("enums.lessonLevel.advanced");
    default:
      return level;
  }
}
