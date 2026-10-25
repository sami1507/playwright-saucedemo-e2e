import { expect, test } from "../src/fixtures";
import { users } from "../src/data/testData";

test.describe("Authentication", () => {
  test("a standard user reaches the product catalogue", { tag: "@smoke" }, async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.signIn(users.standard);

    await expect(page).toHaveURL(/\/inventory\.html$/);
    await expect(page.getByTestId("title")).toHaveText("Products");
  });

  test("a locked-out user sees a clear message and stays on the login page", async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.signIn(users.lockedOut);

    await expect(loginPage.errorMessage).toContainText("Sorry, this user has been locked out.");
    await expect(page).not.toHaveURL(/inventory/);
  });

  const invalidAttempts = [
    { description: "wrong password", username: users.standard.username, password: "not-the-password" },
    { description: "unknown user", username: "ghost_user", password: users.standard.password },
  ];

  for (const attempt of invalidAttempts) {
    test(`rejects a ${attempt.description}`, async ({ loginPage }) => {
      await loginPage.goto();
      await loginPage.signIn(attempt);

      await expect(loginPage.errorMessage).toContainText(
        "Username and password do not match any user in this service",
      );
    });
  }

  test("logging out returns the user to the login form", async ({ inventoryPage, page }) => {
    await page.locator("#react-burger-menu-btn").click();
    await page.getByTestId("logout-sidebar-link").click();

    await expect(page.getByTestId("login-button")).toBeVisible();
    await expect(inventoryPage.items.first()).toBeHidden();
  });
});
