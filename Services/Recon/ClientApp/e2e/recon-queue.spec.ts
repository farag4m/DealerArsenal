import { test, expect } from '@playwright/test';

test.describe('Recon Queue — primary flows', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the API so tests run without a live backend
    await page.route('**/api/recon/queue**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            total: 2,
            items: [
              {
                id: 'issue-1',
                stockNumber: 'A1234',
                year: 2022,
                make: 'Toyota',
                model: 'Camry',
                daysInRecon: 10,
                issueDescription: 'Front bumper scratch and dent',
                costEstimate: 850,
                approvalStatus: 'pending',
                assignedTo: 'Body Shop',
                segment: 'needs_decision',
                isEscalated: true,
                notes: [],
              },
              {
                id: 'issue-2',
                stockNumber: 'B5678',
                year: 2021,
                make: 'Honda',
                model: 'Accord',
                daysInRecon: 3,
                issueDescription: 'Oil change and tire rotation',
                costEstimate: 120,
                approvalStatus: 'approved',
                assignedTo: 'Service Dept',
                segment: 'needs_decision',
                isEscalated: false,
                notes: [],
              },
            ],
          },
        }),
      });
    });

    await page.goto('/');
  });

  test('shows page title', async ({ page }) => {
    await expect(page.getByText('Recon Queue')).toBeVisible();
  });

  test('renders all segment tabs', async ({ page }) => {
    const tabs = [
      'needs_decision',
      'approved_in_progress',
      'waiting_on_parts',
      'at_vendor',
      'aging_alert',
    ];
    for (const tab of tabs) {
      await expect(page.getByTestId(`queue-tab-${tab}`)).toBeVisible();
    }
  });

  test('displays vehicle cards from API response', async ({ page }) => {
    await expect(page.getByTestId('vehicle-grid')).toBeVisible();
    const cards = page.getByTestId('vehicle-card');
    await expect(cards).toHaveCount(2);
  });

  test('shows aging badge on vehicle card', async ({ page }) => {
    const badges = page.getByTestId('aging-badge');
    await expect(badges.first()).toBeVisible();
  });

  test('shows escalation flag on escalated issue', async ({ page }) => {
    await expect(page.getByTestId('escalation-flag')).toBeVisible();
  });

  test('shows approval badge', async ({ page }) => {
    const badges = page.getByTestId('approval-badge');
    await expect(badges.first()).toBeVisible();
  });

  test('filter escalated only checkbox works', async ({ page }) => {
    const checkbox = page.getByTestId('filter-escalated');
    await checkbox.check();
    // After filtering, only escalated issue should remain
    await expect(page.getByTestId('vehicle-card')).toHaveCount(1);
  });

  test('sort select is visible', async ({ page }) => {
    await expect(page.getByTestId('sort-select')).toBeVisible();
  });

  test('clicking segment tab switches active tab', async ({ page }) => {
    const tab = page.getByTestId('queue-tab-approved_in_progress');
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  });
});

test.describe('Recon Queue — issue detail modal', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/recon/queue**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            total: 1,
            items: [
              {
                id: 'issue-1',
                stockNumber: 'A1234',
                year: 2022,
                make: 'Toyota',
                model: 'Camry',
                daysInRecon: 10,
                issueDescription: 'Front bumper scratch',
                costEstimate: 850,
                approvalStatus: 'pending',
                assignedTo: 'Body Shop',
                segment: 'needs_decision',
                isEscalated: false,
                notes: [],
              },
            ],
          },
        }),
      });
    });

    await page.route('**/api/recon/issues/issue-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'issue-1',
            stockNumber: 'A1234',
            year: 2022,
            make: 'Toyota',
            model: 'Camry',
            daysInRecon: 10,
            issueDescription: 'Front bumper scratch',
            costEstimate: 850,
            approvalStatus: 'pending',
            assignedTo: 'Body Shop',
            segment: 'needs_decision',
            isEscalated: false,
            notes: [
              {
                id: 'note-1',
                author: 'Service Manager',
                content: 'Parts ordered, waiting on delivery',
                createdAt: '2026-04-10T10:00:00Z',
              },
            ],
          },
        }),
      });
    });

    await page.goto('/');
  });

  test('opens issue detail modal on card click', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await expect(page.getByTestId('issue-detail-modal')).toBeVisible();
  });

  test('shows notes in detail modal', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await expect(page.getByTestId('notes-log')).toBeVisible();
    await expect(page.getByText('Parts ordered, waiting on delivery')).toBeVisible();
  });

  test('shows approval button for pending issues', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await expect(page.getByTestId('open-approval')).toBeVisible();
  });

  test('closes modal via close button', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await page.getByTestId('close-modal').click();
    await expect(page.getByTestId('issue-detail-modal')).not.toBeVisible();
  });

  test('shows cross-service links', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await expect(page.getByTestId('link-vendors')).toBeVisible();
    await expect(page.getByTestId('link-vehicles')).toBeVisible();
    await expect(page.getByTestId('link-diagnostics')).toBeVisible();
  });
});

test.describe('Recon Queue — approval flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/api/recon/queue**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            total: 1,
            items: [
              {
                id: 'issue-1',
                stockNumber: 'A1234',
                year: 2022,
                make: 'Toyota',
                model: 'Camry',
                daysInRecon: 5,
                issueDescription: 'Paint correction needed',
                costEstimate: 600,
                approvalStatus: 'pending',
                assignedTo: '',
                segment: 'needs_decision',
                isEscalated: false,
                notes: [],
              },
            ],
          },
        }),
      });
    });

    await page.route('**/api/recon/issues/issue-1', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            id: 'issue-1',
            stockNumber: 'A1234',
            year: 2022,
            make: 'Toyota',
            model: 'Camry',
            daysInRecon: 5,
            issueDescription: 'Paint correction needed',
            costEstimate: 600,
            approvalStatus: 'pending',
            assignedTo: '',
            segment: 'needs_decision',
            isEscalated: false,
            notes: [],
          },
        }),
      });
    });

    await page.goto('/');
  });

  test('opens approval modal from detail', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await page.getByTestId('open-approval').click();
    await expect(page.getByTestId('approval-modal')).toBeVisible();
  });

  test('approval modal has decision select', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await page.getByTestId('open-approval').click();
    await expect(page.getByTestId('decision-select')).toBeVisible();
  });

  test('selecting deny shows reason input', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await page.getByTestId('open-approval').click();
    await page.getByTestId('decision-select').selectOption('deny');
    await expect(page.getByTestId('reason-input')).toBeVisible();
  });

  test('selecting approve shows budget input', async ({ page }) => {
    await page.getByTestId('vehicle-card').first().click();
    await page.getByTestId('open-approval').click();
    await expect(page.getByTestId('budget-input')).toBeVisible();
  });
});
