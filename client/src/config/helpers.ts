const options: Intl.DateTimeFormatOptions = {
  month: "numeric",
  day: "numeric",
  year: "numeric",
  hour12: true,
  hour: "numeric",
  minute: "numeric",
};

export const dateFormatter = new Intl.DateTimeFormat(undefined, options);
