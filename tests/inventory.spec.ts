import { expect, test } from "../src/fixtures";

test.describe("Product catalogue", () => {
  test("shows all six products with prices", { tag: "@smoke" }, async ({ inventoryPage }) => {
    await expect(inventoryPage.items).toHaveCount(6);
    expect(await inventoryPage.productPrices()).toHaveLength(6);
  });

  test("sorts by price from low to high", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("lohi");

    const prices = await inventoryPage.productPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test("sorts by name from Z to A", async ({ inventoryPage }) => {
    await inventoryPage.sortBy("za");

    const names = await inventoryPage.productNames();
    expect(names[0]).toBe("Test.allTheThings() T-Shirt (Red)");
    expect(names.at(-1)).toBe("Sauce Labs Backpack");
  });

  test("adding a product updates the cart badge and the button", async ({ inventoryPage }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");

    await expect(inventoryPage.cartBadge).toHaveText("1");
    await expect(
      inventoryPage.itemCard("Sauce Labs Backpack").getByRole("button", { name: "Remove" }),
    ).toBeVisible();
  });

  test("removing a product clears the cart badge", async ({ inventoryPage }) => {
    await inventoryPage.addToCart("Sauce Labs Bike Light");
    await inventoryPage.removeFromCart("Sauce Labs Bike Light");

    await expect(inventoryPage.cartBadge).toHaveCount(0);
  });
});
