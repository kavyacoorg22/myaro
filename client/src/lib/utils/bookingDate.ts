export const formatDate = (date: Date | string): string => {
  if (typeof date === "string") {
    // Extract date parts directly to avoid timezone shifting
    const [year, month, day] = date.split("T")[0].split("-").map(Number);
    const d = new Date(year, month - 1, day); // local date, no UTC shift
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};