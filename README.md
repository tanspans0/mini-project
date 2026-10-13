# TSEC Sync — Smart Campus Timetable & Room Management System

A frontend React prototype for **Thadomal Shahani Engineering College** that
centralizes timetables, room/lab/seminar-hall availability, events and
real-time schedule-change notifications across the Old Building and New
Building, for three roles: **Student**, **Teacher** and **Management**.

---

## 1. Install & run

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To build a static production bundle:

```bash
npm run build
npm run preview
```

## 2. Demo logins

| Role       | Email               | Password    |
|------------|----------------------|-------------|
| Student    | student@tsec.edu     | student123  |
| Teacher    | teacher@tsec.edu     | teacher123  |
| Management | admin@tsec.edu       | admin123    |

The login page also has a **"Fill demo credentials"** button per role.

## 3. Project structure

```
src/
  data/            mock "database" — departments, rooms, users, timetable
                   generator + overrides, events, seminars
  context/         AuthContext (mock login), DataContext (bookings —
                   the in-memory state teachers/management mutate),
                   NotificationsContext (derives the notification feed)
  utils/           changeDetection.js, conflictDetection.js — the two
                   pieces of "business logic" in the app
  components/      reusable UI: Sidebar, Topbar, cards, forms, Modal, Toast
  pages/           one file per route (dashboards, timetable, rooms,
                   events, seminars, notifications, profile, login, home)
```

## 4. How to explain this at your viva

**Q: Where does the timetable data come from?**
`src/data/timetable.js` has `generateRegularTimetable(deptId, semester)`.
Instead of hand-writing every department/semester/day combination, it
deterministically builds one from a small subject list per department
(`subjectBank`) so any department + semester you pick in the filters has a
believable timetable. This is the **REGULAR** schedule.

**Q: How does the "Schedule Changed" alert work?**
Alongside the regular schedule there's a short list of `scheduleOverrides`
— the **UPDATED** schedule — each pointing at one regular slot by `matchId`
with only the fields that changed (room, time, building, faculty, or
status). `src/utils/changeDetection.js` has `getEffectiveSlot()`, which
takes a regular slot, looks for a matching override, and diffs field by
field — exactly the brief's logic:

```js
if (regularRoom !== updatedRoom) show "Room Changed"
```

The Timetable grid, the Student Dashboard's "Today's Schedule" and the
Notifications page all call this same function, so the change only has to
be described once in the data and it surfaces everywhere consistently.

**Q: How is double-booking prevented?**
`src/utils/conflictDetection.js` has `rangesOverlap()` (a standard interval
overlap check: `startA < endB && startB < endA`) and `findConflict()`,
which scans existing bookings for the same room and date. `BookingForm`
calls `createBooking()` in `DataContext`, which runs this check before
adding the booking — if it fails, the form shows the
"Room unavailable" message instead of saving.

**Q: Where is the booking data stored?**
In `DataContext`, as React state (`useState`) seeded from
`data/rooms.js`. It's in-memory only (resets on refresh) since this is a
frontend-only prototype — swapping in a real backend means replacing the
functions inside `DataContext.jsx` with API calls; no page or component
needs to change because they all go through the same context functions
(`createBooking`, `cancelBooking`, `isRoomAvailable`, …).

**Q: How would you connect a real backend?**
Two files are the seams: `data/users.js` + the `login()` function in
`AuthContext.jsx` (auth), and `DataContext.jsx` (bookings/rooms). Everything
else consumes these through context, so a real API integration is a
localized change.

## 5. Notes on the mock data

Room numbers (C-301, N-204, IT-201, etc.) are invented for this prototype
and are **not** TSEC's actual room numbers — replace `src/data/rooms.js`
with the real room register when this moves past a mini-project demo.
The demo's "today" is fixed to **25 September 2026 (a Friday)** — see
`DEMO_TODAY` in `src/data/timetable.js` — so the seeded schedule changes
always show up when you run the project. In a production build this would
be `new Date()` instead.
