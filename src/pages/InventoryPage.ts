import type { Locator, Page } from "@playwright/test";
import { parseMoney } from "../utils/money";

export type SortOption = "az" | "za" | "lohi" | "hilo";

export class InventoryPage {
  readonly title: Locator;
  readonly items: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  private readonly names: Locator;
  private readonly prices: Locator;

  constructor(page: Page) {
    this.title = page.getByTestId("title");
    this.items = page.getByTestId("inventory-item");
    this.cartLink = page.getByTestId("shopping-cart-link");
    this.cartBadge = page.getByTestId("shopping-cart-badge");
    this.sortDropdown = page.getByTestId("product-sort-container");
    this.names = page.getByTestId("inventory-item-name");
    this.prices = page.getByTestId("inventory-item-price");
  }

  /** The card for one product, found by its visible name. */
  itemCard(productName: string): Locator {
    return this.items.filter({ hasText: productName });
  }

  async addToCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole("button", { name: "Add to cart" }).click();
  }

  async removeFromCart(productName: string): Promise<void> {
    await this.itemCard(productName).getByRole("button", { name: "Remove" }).click();
  }

  async sortBy(option: SortOption): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async productNames(): Promise<string[]> {
    return this.names.allTextContents();
  }

  async productPrices(): Promise<number[]> {
    return (await this.prices.allTextContents()).map(parseMoney);
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
