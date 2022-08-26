const dateFormatterOptions: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
};

export const dateFormatter = new Intl.DateTimeFormat(
  undefined,
  dateFormatterOptions
);
