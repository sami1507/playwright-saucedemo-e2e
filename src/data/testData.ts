export interface Credentials {
  username: string;
  password: string;
}

/** Public demo accounts documented on the SauceDemo login page. */
export const users = {
  standard: { username: "standard_user", password: "secret_sauce" },
  lockedOut: { username: "locked_out_user", password: "secret_sauce" },
} satisfies Record<string, Credentials>;

export interface ShippingDetails {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export const shippingDetails: ShippingDetails = {
  firstName: "Ada",
  lastName: "Lovelace",
  postalCode: "SW1A 1AA",
};
