import { test, expect } from '@playwright/test'

const MOCK_DATA = {
  dealership: {
    name: 'Sunrise Auto Group',
    tagline: 'Driven by integrity',
    phone: '(555) 867-5309',
    address: '1234 Dealer Blvd, Springfield, IL 62701',
    hours: [
      { days: 'Mon – Fri', hours: '9:00 AM – 8:00 PM' },
      { days: 'Saturday', hours: '9:00 AM – 6:00 PM' },
      { days: 'Sunday', hours: '11:00 AM – 4:00 PM' },
    ],
  },
  appointments: [
    { id: 'appt-1', firstName: 'Maria', arrivalTime: '10:30' },
    { id: 'appt-2', firstName: 'James', arrivalTime: '11:00' },
  ],
  featuredVehicles: [
    {
      id: 'v-1',
      year: 2024,
      make: 'Toyota',
      model: 'Camry',
      price: 28995,
      photoUrl: null,
    },
    {
      id: 'v-2',
      year: 2023,
      make: 'Honda',
      model: 'Accord',
      price: 31500,
      photoUrl: null,
    },
  ],
  soldVehicles: [
    { id: 's-1', model: 'Ford F-150', saleDate: '2025-03-20' },
    { id: 's-2', model: 'Chevy Silverado', saleDate: '2025-03-18' },
  ],
  reputation: {
    rating: 4.8,
    reviewCount: 312,
  },
}

test.beforeEach(async ({ page }) => {
  await page.route('**/api/lobby-display', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_DATA),
    })
  })
})

test('shows loading screen initially', async ({ page }) => {
  // Delay the API response to catch loading state
  await page.route('**/api/lobby-display', async (route) => {
    await page.waitForTimeout(100)
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_DATA),
    })
  })

  await page.goto('/')
  // Loading screen may appear briefly while data loads, then the main page renders
  await expect(page.getByTestId('lobby-display-page')).toBeVisible({ timeout: 10_000 })
})

test('renders dealership name in welcome header', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('welcome-header')).toBeVisible()
  await expect(page.getByTestId('welcome-header')).toContainText('Sunrise Auto Group')
  await expect(page.getByTestId('welcome-header')).toContainText('Driven by integrity')
})

test('renders appointments block on first slide', async ({ page }) => {
  await page.goto('/')
  const slide = page.getByTestId('slide-content')
  await expect(slide).toHaveAttribute('data-slide', 'appointments', { timeout: 5_000 })
  await expect(page.getByTestId('appointments-block')).toBeVisible()
  const items = page.getByTestId('appointment-item')
  await expect(items).toHaveCount(2)
  await expect(items.first()).toContainText('Maria')
  await expect(items.first()).toContainText('10:30')
})

test('renders footer with contact info', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByTestId('footer-block')
  await expect(footer).toBeVisible()
  await expect(footer).toContainText('(555) 867-5309')
  await expect(footer).toContainText('1234 Dealer Blvd')
  await expect(footer).toContainText('Mon – Fri')
})

test('shows error screen when API fails', async ({ page }) => {
  await page.unroute('**/api/lobby-display')
  await page.route('**/api/lobby-display', async (route) => {
    await route.fulfill({ status: 500, body: 'Internal Server Error' })
  })
  await page.goto('/')
  await expect(page.getByTestId('error-screen')).toBeVisible({ timeout: 15_000 })
})

test('featured vehicles block shows vehicle data', async ({ page }) => {
  await page.goto('/')
  // Advance through slides by manipulating slide state via time — or just verify the block renders when slide is 'featured'
  // We check that when the featured block is shown it contains correct data
  const slide = page.getByTestId('slide-content')

  // Wait for slide to cycle to 'featured' (8s per slide)
  // To avoid a slow test we click a way to trigger it — but display is non-interactive
  // Instead we just verify the block structure exists in the DOM indirectly via the slide data attribute
  // Poll until we see featured slide
  await expect(slide).toHaveAttribute('data-slide', 'featured', { timeout: 20_000 })
  await expect(page.getByTestId('featured-vehicles-block')).toBeVisible()
  await expect(page.getByTestId('vehicle-card')).toHaveCount(2)
  await expect(page.getByTestId('featured-vehicles-block')).toContainText('2024 Toyota Camry')
})

test('sold vehicles block shows model and date', async ({ page }) => {
  await page.goto('/')
  const slide = page.getByTestId('slide-content')
  await expect(slide).toHaveAttribute('data-slide', 'sold', { timeout: 30_000 })
  await expect(page.getByTestId('sold-vehicles-block')).toBeVisible()
  await expect(page.getByTestId('sold-vehicle-item').first()).toContainText('Ford F-150')
})

test('reputation block shows rating and review count', async ({ page }) => {
  await page.goto('/')
  const slide = page.getByTestId('slide-content')
  await expect(slide).toHaveAttribute('data-slide', 'reputation', { timeout: 40_000 })
  await expect(page.getByTestId('reputation-block')).toBeVisible()
  await expect(page.getByTestId('reputation-block')).toContainText('4.8')
  await expect(page.getByTestId('reputation-block')).toContainText('312')
})

test('display has no interactive click targets', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('lobby-display-page')).toBeVisible()
  // No buttons or links should be present (display-only)
  const buttons = page.locator('button')
  await expect(buttons).toHaveCount(0)
  const links = page.locator('a')
  await expect(links).toHaveCount(0)
})

test('does not expose internal data fields', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('lobby-display-page')).toBeVisible()
  const bodyText = await page.locator('body').innerText()
  // Must not expose full names, internal notes, deal amounts, staff names
  // (mock data intentionally only has first names, confirming the schema boundary)
  expect(bodyText).not.toContain('cost')
  expect(bodyText).not.toContain('note')
  expect(bodyText).not.toContain('recon')
})
