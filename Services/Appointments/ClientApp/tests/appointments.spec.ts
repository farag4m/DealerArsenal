import { expect, test, type Page } from '@playwright/test';

// ─── Mock data ────────────────────────────────────────────────────────────────

const now = new Date();
const inOneHour = new Date(now.getTime() + 60 * 60 * 1000).toISOString();
const inThreeHours = new Date(now.getTime() + 3 * 60 * 60 * 1000).toISOString();
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();

const MOCK_APPOINTMENTS = [
  {
    id: 'appt-1',
    customerName: 'Alice Johnson',
    customerPhone: '555-0101',
    scheduledAt: inOneHour,
    vehicleInterest: '2022 Toyota Camry',
    vehicleId: 'veh-1',
    status: 'Confirmed',
    assignedStaffName: 'Bob Smith',
    assignedStaffId: 'staff-1',
  },
  {
    id: 'appt-2',
    customerName: 'Carlos Rivera',
    customerPhone: '555-0202',
    scheduledAt: yesterday,
    vehicleInterest: '2020 Honda Civic',
    vehicleId: 'veh-2',
    status: 'Scheduled',
    assignedStaffName: null,
    assignedStaffId: null,
  },
  {
    id: 'appt-3',
    customerName: 'Diana Lee',
    customerPhone: '555-0303',
    scheduledAt: inThreeHours,
    vehicleInterest: null,
    vehicleId: null,
    status: 'Arrived',
    assignedStaffName: 'Bob Smith',
    assignedStaffId: 'staff-1',
  },
  {
    id: 'appt-4',
    customerName: 'Eric Patel',
    customerPhone: '555-0404',
    scheduledAt: tomorrow,
    vehicleInterest: '2023 Ford F-150',
    vehicleId: 'veh-4',
    status: 'Scheduled',
    assignedStaffName: null,
    assignedStaffId: null,
  },
];

const MOCK_APPOINTMENT_DETAIL = {
  id: 'appt-1',
  customerId: 'cust-1',
  customerName: 'Alice Johnson',
  customerPhone: '555-0101',
  customerEmail: 'alice@example.com',
  vehicleId: 'veh-1',
  vehicleInterest: '2022 Toyota Camry',
  vehicleStage: 'Live',
  prepCheckpoints: {
    vehiclePulledAndReady: true,
    keysAvailable: false,
    testDrivePathClear: true,
    locationConfirmed: true,
    reconComplete: true,
  },
  scheduledAt: inOneHour,
  status: 'Confirmed',
  assignedStaffId: 'staff-1',
  assignedStaffName: 'Bob Smith',
  followUpAction: 'Call customer to confirm financing options',
  followUpDueDate: tomorrow.split('T')[0] ?? tomorrow,
  followUpOwnerId: 'staff-1',
  followUpOwnerName: 'Bob Smith',
  outcome: null,
  notes: 'Customer is very interested, prefers blue color.',
  createdAt: yesterday,
  updatedAt: now.toISOString(),
};

const MOCK_STAFF = [
  { id: 'staff-1', name: 'Bob Smith', role: 'Sales' },
  { id: 'staff-2', name: 'Carol White', role: 'BDC' },
];

function apiResponse<T>(data: T) {
  return { success: true, data };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function mockApis(page: Page): Promise<void> {
  await page.route('**/api/appointments', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(apiResponse(MOCK_APPOINTMENTS)),
      });
    } else if (route.request().method() === 'POST') {
      const body = route.request().postDataJSON() as Record<string, unknown>;
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify(
          apiResponse({ ...MOCK_APPOINTMENT_DETAIL, id: 'appt-new', customerName: String(body['customerName'] ?? '') }),
        ),
      });
    } else {
      await route.continue();
    }
  });

  await page.route('**/api/appointments/appt-1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiResponse(MOCK_APPOINTMENT_DETAIL)),
    });
  });

  await page.route('**/api/appointments/appt-1/status', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(
        apiResponse({ ...MOCK_APPOINTMENT_DETAIL, status: 'Arrived' }),
      ),
    });
  });

  await page.route('**/api/appointments/appt-1/prep', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiResponse(MOCK_APPOINTMENT_DETAIL)),
    });
  });

  await page.route('**/api/appointments/appt-1/followup', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiResponse(MOCK_APPOINTMENT_DETAIL)),
    });
  });

  await page.route('**/api/staff', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(apiResponse(MOCK_STAFF)),
    });
  });
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Appointments — Queue View', () => {
  test.beforeEach(async ({ page }) => {
    await mockApis(page);
    await page.goto('/appointments');
  });

  test('renders page title and new appointment button', async ({ page }) => {
    await expect(page.getByTestId('page-title')).toHaveText('Appointments');
    await expect(page.getByTestId('new-appointment-btn')).toBeVisible();
  });

  test('shows queue tab active by default', async ({ page }) => {
    await expect(page.getByTestId('tab-queue')).toBeVisible();
    await expect(page.getByTestId('queue-view')).toBeVisible();
  });

  test('lists appointments in the table', async ({ page }) => {
    const rows = page.getByTestId('appointment-row');
    await expect(rows).toHaveCount(4);
  });

  test('shows Alice Johnson in the list', async ({ page }) => {
    await expect(page.getByText('Alice Johnson')).toBeVisible();
  });

  test('overdue appointment shows urgency badge', async ({ page }) => {
    // Carlos Rivera has scheduledAt = yesterday, status Scheduled → overdue
    const urgencyBadges = page.getByTestId('urgency-badge');
    await expect(urgencyBadges.first()).toBeVisible();
  });

  test('filters by Confirmed status', async ({ page }) => {
    await page.getByTestId('filter-confirmed').click();
    const rows = page.getByTestId('appointment-row');
    await expect(rows).toHaveCount(1);
    await expect(page.getByText('Alice Johnson')).toBeVisible();
  });

  test('filters by Arrived status', async ({ page }) => {
    await page.getByTestId('filter-arrived').click();
    const rows = page.getByTestId('appointment-row');
    await expect(rows).toHaveCount(1);
    await expect(page.getByText('Diana Lee')).toBeVisible();
  });

  test('shows empty state when filter has no matches', async ({ page }) => {
    await page.getByTestId('filter-completed').click();
    await expect(page.getByTestId('empty-state')).toBeVisible();
  });

  test('navigates to detail page on row click', async ({ page }) => {
    await page.getByTestId('appointment-link').first().click();
    await expect(page).toHaveURL(/\/appointments\/appt-\d+/);
  });
});

test.describe('Appointments — Calendar View', () => {
  test.beforeEach(async ({ page }) => {
    await mockApis(page);
    await page.goto('/appointments');
    await page.getByTestId('tab-calendar').click();
  });

  test('switches to calendar view', async ({ page }) => {
    await expect(page.getByTestId('calendar-view')).toBeVisible();
  });

  test('shows month label', async ({ page }) => {
    await expect(page.getByTestId('month-label')).toBeVisible();
  });

  test('navigates to previous month', async ({ page }) => {
    const label = await page.getByTestId('month-label').textContent();
    await page.getByTestId('prev-month').click();
    const newLabel = await page.getByTestId('month-label').textContent();
    expect(newLabel).not.toBe(label);
  });

  test('navigates to next month', async ({ page }) => {
    const label = await page.getByTestId('month-label').textContent();
    await page.getByTestId('next-month').click();
    const newLabel = await page.getByTestId('month-label').textContent();
    expect(newLabel).not.toBe(label);
  });

  test('renders calendar day cells', async ({ page }) => {
    const days = page.getByTestId('calendar-day');
    await expect(days.first()).toBeVisible();
  });
});

test.describe('Create Appointment Modal', () => {
  test.beforeEach(async ({ page }) => {
    await mockApis(page);
    await page.goto('/appointments');
  });

  test('opens modal on button click', async ({ page }) => {
    await page.getByTestId('new-appointment-btn').click();
    await expect(page.getByTestId('create-appointment-modal')).toBeVisible();
  });

  test('closes modal on × button', async ({ page }) => {
    await page.getByTestId('new-appointment-btn').click();
    await expect(page.getByTestId('create-appointment-modal')).toBeVisible();
    await page.getByTestId('modal-close-btn').click();
    await expect(page.getByTestId('create-appointment-modal')).not.toBeVisible();
  });

  test('shows validation errors on empty submit', async ({ page }) => {
    await page.getByTestId('new-appointment-btn').click();
    await page.getByTestId('submit-appointment-btn').click();
    await expect(page.getByText('Customer name is required')).toBeVisible();
  });

  test('submits form with valid data', async ({ page }) => {
    await page.getByTestId('new-appointment-btn').click();

    await page.getByTestId('input-customer-name').fill('Test Customer');
    await page.getByTestId('input-customer-phone').fill('555-9999');
    await page.getByTestId('input-scheduled-at').fill('2026-05-01T10:00');

    await page.getByTestId('submit-appointment-btn').click();

    // Modal should close after successful create
    await expect(page.getByTestId('create-appointment-modal')).not.toBeVisible();
  });
});

test.describe('Appointment Detail Page', () => {
  test.beforeEach(async ({ page }) => {
    await mockApis(page);
    await page.goto('/appointments/appt-1');
  });

  test('shows customer name in header', async ({ page }) => {
    await expect(page.getByTestId('detail-customer-name')).toHaveText('Alice Johnson');
  });

  test('shows status badge', async ({ page }) => {
    await expect(page.getByTestId('status-badge-confirmed')).toBeVisible();
  });

  test('shows customer context card', async ({ page }) => {
    await expect(page.getByTestId('customer-context')).toBeVisible();
    await expect(page.getByText('555-0101')).toBeVisible();
  });

  test('shows vehicle context card', async ({ page }) => {
    await expect(page.getByTestId('vehicle-context')).toBeVisible();
    await expect(page.getByText('2022 Toyota Camry')).toBeVisible();
  });

  test('shows prep checklist card', async ({ page }) => {
    await expect(page.getByTestId('prep-checklist')).toBeVisible();
  });

  test('shows follow-up card', async ({ page }) => {
    await expect(page.getByTestId('followup-card')).toBeVisible();
    await expect(page.getByText('Call customer to confirm financing options')).toBeVisible();
  });

  test('shows notes card', async ({ page }) => {
    await expect(page.getByTestId('notes-card')).toBeVisible();
    await expect(page.getByText(/Customer is very interested/)).toBeVisible();
  });

  test('advance status button is visible', async ({ page }) => {
    await expect(page.getByTestId('btn-advance-status')).toBeVisible();
    await expect(page.getByTestId('btn-advance-status')).toHaveText('Mark Arrived');
  });

  test('clicking advance status sends patch request', async ({ page }) => {
    let patchCalled = false;
    await page.route('**/api/appointments/appt-1/status', async (route) => {
      patchCalled = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(
          apiResponse({ ...MOCK_APPOINTMENT_DETAIL, status: 'Arrived' }),
        ),
      });
    });
    await page.getByTestId('btn-advance-status').click();
    expect(patchCalled).toBe(true);
  });

  test('opens follow-up edit form', async ({ page }) => {
    await page.getByTestId('edit-followup-btn').click();
    await expect(page.getByTestId('followup-form')).toBeVisible();
  });

  test('back navigation returns to list', async ({ page }) => {
    await page.getByRole('link', { name: 'Appointments' }).click();
    await expect(page).toHaveURL('/appointments');
  });
});
