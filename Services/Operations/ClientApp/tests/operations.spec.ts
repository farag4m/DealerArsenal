import { test, expect, type Page } from '@playwright/test'

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function mockEmptyApiResponses(page: Page): Promise<void> {
  await page.route('**/api/operations/**', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ data: [], success: true, message: null }),
    })
  })
}

async function mockMyDayItems(page: Page): Promise<void> {
  await page.route('**/api/operations/my-day', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: null,
        data: [
          {
            id: 'item-1',
            title: 'Inspect unit 4821',
            type: 'vehicle_task',
            status: 'todo',
            priority: 'high',
            dueTime: '10:00 AM',
            vehicleId: 'v-1',
            vehicleLabel: '2023 Ford F-150',
            customerName: null,
            assigneeId: 'me',
            notes: null,
            snoozedUntil: null,
            stuckSince: null,
          },
          {
            id: 'item-2',
            title: 'Call back Jane Doe',
            type: 'customer_followup',
            status: 'todo',
            priority: 'urgent',
            dueTime: '11:30 AM',
            vehicleId: null,
            vehicleLabel: null,
            customerName: 'Jane Doe',
            assigneeId: 'me',
            notes: null,
            snoozedUntil: null,
            stuckSince: null,
          },
        ],
      }),
    })
  })
}

async function mockBoardItems(page: Page): Promise<void> {
  await page.route('**/api/operations/board**', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: null,
        data: [
          {
            id: 'b-1',
            title: 'Recon unit 9921',
            type: 'vehicle_task',
            status: 'in_progress',
            priority: 'medium',
            dueTime: null,
            vehicleId: 'v-2',
            vehicleLabel: '2022 Toyota Camry',
            customerName: null,
            assigneeId: 'user-2',
            assigneeName: 'Alex Smith',
            notes: null,
            snoozedUntil: null,
            stuckSince: null,
          },
          {
            id: 'b-2',
            title: 'Photo shoot #3310',
            type: 'vehicle_task',
            status: 'blocked',
            priority: 'high',
            dueTime: null,
            vehicleId: 'v-3',
            vehicleLabel: '2021 Honda Civic',
            customerName: null,
            assigneeId: 'user-3',
            assigneeName: 'Beth Jones',
            notes: null,
            snoozedUntil: null,
            stuckSince: '2026-04-15T09:00:00Z',
          },
        ],
      }),
    })
  })
}

async function mockTeam(page: Page): Promise<void> {
  await page.route('**/api/operations/team', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: null,
        data: [
          {
            id: 'user-1',
            name: 'Alice Brown',
            role: 'Service Advisor',
            assignedCount: 4,
            completedToday: 2,
            blockedCount: 0,
            overloadedThreshold: 10,
            available: true,
          },
          {
            id: 'user-2',
            name: 'Bob Green',
            role: 'Technician',
            assignedCount: 12,
            completedToday: 1,
            blockedCount: 1,
            overloadedThreshold: 10,
            available: true,
          },
        ],
      }),
    })
  })
}

async function mockTasksAndPhotos(page: Page): Promise<void> {
  await page.route('**/api/operations/tasks', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: null,
        data: [
          {
            id: 't-1',
            title: 'Detail unit before delivery',
            status: 'todo',
            priority: 'medium',
            vehicleId: 'v-1',
            vehicleLabel: '2023 Ford F-150',
            ownerId: 'user-1',
            ownerName: 'Alice Brown',
            dueDate: '2026-04-17',
          },
        ],
      }),
    })
  })

  await page.route('**/api/operations/vehicle-photos', (route) => {
    void route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: null,
        data: [
          {
            vehicleId: 'v-1',
            vehicleLabel: '2023 Ford F-150',
            vin: '1FTFW1E53NFA12345',
            photoStatus: 'pending',
            photoCount: 0,
            awaitingPhotography: true,
            lastPhotoDate: null,
          },
          {
            vehicleId: 'v-2',
            vehicleLabel: '2022 Toyota Camry',
            vin: null,
            photoStatus: 'complete',
            photoCount: 8,
            awaitingPhotography: false,
            lastPhotoDate: '2026-04-14',
          },
        ],
      }),
    })
  })
}

// ─── Tests ────────────────────────────────────────────────────────────────────

test.describe('Operations service', () => {
  test('renders tab navigation with all four tabs', async ({ page }) => {
    await mockEmptyApiResponses(page)
    await page.goto('/')
    await expect(page.getByRole('link', { name: 'My Day' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Board' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Team' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Tasks & Photos' })).toBeVisible()
  })

  test('/ redirects to /my-day', async ({ page }) => {
    await mockEmptyApiResponses(page)
    await page.goto('/')
    await expect(page).toHaveURL('/my-day')
    await expect(page.getByTestId('my-day-page')).toBeVisible()
  })

  test('/tasks redirects to /tasks-photos', async ({ page }) => {
    await mockEmptyApiResponses(page)
    await page.goto('/tasks')
    await expect(page).toHaveURL('/tasks-photos')
    await expect(page.getByTestId('tasks-photos-page')).toBeVisible()
  })
})

test.describe('My Day tab', () => {
  test('displays work items with actions', async ({ page }) => {
    await mockMyDayItems(page)
    await page.goto('/my-day')
    const cards = page.getByTestId('work-item-card')
    await expect(cards).toHaveCount(2)
    await expect(page.getByText('Inspect unit 4821')).toBeVisible()
    await expect(page.getByText('Call back Jane Doe')).toBeVisible()
  })

  test('shows empty state when no items', async ({ page }) => {
    await mockEmptyApiResponses(page)
    await page.goto('/my-day')
    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByText('All clear for today')).toBeVisible()
  })

  test('complete and blocked action buttons are present', async ({ page }) => {
    await mockMyDayItems(page)
    await page.goto('/my-day')
    const completeButtons = page.getByRole('button', { name: 'Mark complete' })
    await expect(completeButtons.first()).toBeVisible()
    const blockedButtons = page.getByRole('button', { name: 'Flag blocked' })
    await expect(blockedButtons.first()).toBeVisible()
  })
})

test.describe('Board tab', () => {
  test('renders all four kanban columns', async ({ page }) => {
    await mockBoardItems(page)
    await page.goto('/board')
    await expect(page.getByTestId('board-page')).toBeVisible()
    // Target column header spans specifically to avoid matching select <option> text
    await expect(page.locator('span.font-semibold', { hasText: 'To Do' }).first()).toBeVisible()
    await expect(page.locator('span.font-semibold', { hasText: 'In Progress' }).first()).toBeVisible()
    await expect(page.locator('span.font-semibold', { hasText: 'Blocked' }).first()).toBeVisible()
    await expect(page.locator('span.font-semibold', { hasText: 'Done' }).first()).toBeVisible()
  })

  test('shows stuck indicator on blocked items with stuckSince', async ({ page }) => {
    await mockBoardItems(page)
    await page.goto('/board')
    const stuckBadges = page.getByText('Stuck')
    await expect(stuckBadges.first()).toBeVisible()
  })

  test('filter dropdowns are present', async ({ page }) => {
    await mockBoardItems(page)
    await page.goto('/board')
    await expect(page.getByRole('combobox', { name: 'Filter by work type' })).toBeVisible()
    await expect(page.getByPlaceholder('Filter by assignee…')).toBeVisible()
  })
})

test.describe('Team tab', () => {
  test('renders team member rows', async ({ page }) => {
    // Register catch-all first — Playwright LIFO means last-registered wins,
    // so mockTeam (registered after) takes priority for /team requests.
    await page.route('**/api/operations/**', (route) => {
      void route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], success: true, message: null }),
      })
    })
    await mockTeam(page)
    await page.goto('/team')
    const rows = page.getByTestId('team-member-row')
    await expect(rows).toHaveCount(2)
    await expect(page.getByText('Alice Brown')).toBeVisible()
    await expect(page.getByText('Bob Green')).toBeVisible()
  })

  test('shows overloaded badge for member exceeding threshold', async ({ page }) => {
    await mockTeam(page)
    await page.goto('/team')
    await expect(page.getByText('Overloaded')).toBeVisible()
  })

  test('View Day button opens member panel', async ({ page }) => {
    await mockTeam(page)
    await page.route('**/api/operations/team/**/day', (route) => {
      void route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], success: true, message: null }),
      })
    })
    await page.goto('/team')
    await page.getByRole('button', { name: "View Alice Brown's day" }).click()
    await expect(page.getByTestId('member-day-panel')).toBeVisible()
    await expect(page.getByText('Read-only queue')).toBeVisible()
  })
})

test.describe('Tasks & Photos tab', () => {
  test('renders tasks table and photo tracking cards', async ({ page }) => {
    await mockTasksAndPhotos(page)
    await page.goto('/tasks-photos')
    await expect(page.getByTestId('tasks-photos-page')).toBeVisible()
    await expect(page.getByText('Detail unit before delivery')).toBeVisible()
    const photoCards = page.getByTestId('vehicle-photo-card')
    await expect(photoCards).toHaveCount(2)
  })

  test('highlights vehicles awaiting photography', async ({ page }) => {
    await mockTasksAndPhotos(page)
    await page.goto('/tasks-photos')
    await expect(page.getByText('1 awaiting photography')).toBeVisible()
  })
})
