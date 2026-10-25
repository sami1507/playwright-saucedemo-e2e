import { expect, test } from "../src/fixtures";
import { shippingDetails } from "../src/data/testData";
import { toCents } from "../src/utils/money";

test.describe("Checkout", () => {
  test("a customer can buy two products end to end", { tag: "@smoke" }, async ({
    inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.addToCart("Sauce Labs Bike Light");
    await inventoryPage.openCart();
    await expect(cartPage.items).toHaveCount(2);

    await cartPage.checkout();
    await checkoutPage.fillShippingDetails(shippingDetails);
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();

    await expect(checkoutPage.completeHeader).toHaveText("Thank you for your order!");
  });

  test("shipping details are required before continuing", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart("Sauce Labs Onesie");
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.continueToOverview();

    await expect(checkoutPage.errorMessage).toHaveText("Error: First Name is required");
  });

  test("the order total equals the item total plus tax", async ({ inventoryPage, cartPage, checkoutPage }) => {
    await inventoryPage.addToCart("Sauce Labs Backpack");
    await inventoryPage.addToCart("Sauce Labs Bike Light");
    await inventoryPage.openCart();
    await cartPage.checkout();
    await checkoutPage.fillShippingDetails(shippingDetails);
    await checkoutPage.continueToOverview();

    const cartTotal = (await cartPage.productPrices()).reduce((sum, price) => sum + toCents(price), 0);
    const { subtotal, tax, total } = await checkoutPage.orderTotals();

    expect(toCents(subtotal)).toBe(cartTotal);
    expect(toCents(subtotal) + toCents(tax)).toBe(toCents(total));
  });
});
