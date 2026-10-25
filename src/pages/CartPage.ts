import type { Locator, Page } from "@playwright/test";
import { parseMoney } from "../utils/money";

export class CartPage {
  readonly items: Locator;
  readonly checkoutButton: Locator;
  private readonly names: Locator;
  private readonly prices: Locator;

  constructor(page: Page) {
    this.items = page.getByTestId("inventory-item");
    this.checkoutButton = page.getByTestId("checkout");
    this.names = page.getByTestId("inventory-item-name");
    this.prices = page.getByTestId("inventory-item-price");
  }

  async productNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async productPrices(): Promise<number[]> {
    return (await this.prices.allTextContents()).map(parseMoney);
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
