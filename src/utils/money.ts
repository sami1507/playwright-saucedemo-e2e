/** Parses the first dollar amount in a string, e.g. "$1,234.50" becomes 1234.5. */
export function parseMoney(text: string): number {
  const match = /(\d[\d,]*\.\d{2})/.exec(text);
  if (!match) {
    throw new Error(`No dollar amount found in "${text}"`);
  }
  return Number(match[1].replace(/,/g, ""));
}

/** Reads the amount that follows a label, e.g. amountAfter("Tax", "Tax: $2.40") is 2.4. */
export function amountAfter(label: string, text: string): number {
  const match = new RegExp(`${label}:\\s*\\$([\\d,]+\\.\\d{2})`).exec(text);
  if (!match) {
    throw new Error(`Could not find "${label}" in "${text}"`);
  }
  return Number(match[1].replace(/,/g, ""));
}

/** Converts dollars to whole cents so totals can be compared without floating-point error. */
export function toCents(dollars: number): number {
  return Math.round(dollars * 100);
}
