import type { Locator, Page } from "@playwright/test";
import type { ShippingDetails } from "../data/testData";
import { amountAfter } from "../utils/money";

export interface OrderTotals {
  subtotal: number;
  tax: number;
  total: number;
}

/** Covers all three checkout steps: shipping details, overview and confirmation. */
export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  private readonly summary: Locator;

  constructor(page: Page) {
    this.firstNameInput = page.getByTestId("firstName");
    this.lastNameInput = page.getByTestId("lastName");
    this.postalCodeInput = page.getByTestId("postalCode");
    this.continueButton = page.getByRole("button", { name: "Continue" });
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.errorMessage = page.getByTestId("error");
    this.completeHeader = page.locator(".complete-header");
    this.summary = page.locator(".summary_info");
  }

  async fillShippingDetails({ firstName, lastName, postalCode }: ShippingDetails): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  async orderTotals(): Promise<OrderTotals> {
    const text = await this.summary.innerText();
    return {
      subtotal: amountAfter("Item total", text),
      tax: amountAfter("Tax", text),
      total: amountAfter("Total", text),
    };
  }
}
