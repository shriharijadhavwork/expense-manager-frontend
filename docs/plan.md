# Frontend Implementation Plan

> **Status:** 70% implementation plan — expected to evolve as the product is built.

## 1. Goal

Build a web client that is independent of the backend implementation and can later coexist with a Flutter mobile client.

The frontend should communicate with the backend through an API.

```text
Next.js Web
    |
    | HTTPS / REST API
    ↓
Node.js + TypeScript Backend
```

The frontend should **not** directly communicate with:

- Gemini
- LangGraph
- MongoDB
- Slack

---

# 2. Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel
- REST API initially

---

# 3. Project Foundation

- [ ] Create Next.js application
- [ ] Enable TypeScript
- [ ] Configure Tailwind CSS
- [ ] Configure environment variables
- [ ] Create basic project structure
- [ ] Create API client layer
- [ ] Create common error handling
- [ ] Create common loading states
- [ ] Learn TypeScript while building

Example environment variable:

```env
NEXT_PUBLIC_API_URL=https://api.example.com
```

The actual backend URL will change between development and production.

---

# 4. Authentication

## Features

- [ ] Register
- [ ] Login
- [ ] Logout
- [ ] Session handling
- [ ] Protected routes
- [ ] Current-user information
- [ ] Authentication error handling

Basic flow:

```text
User
 ↓
Next.js Login
 ↓
Node.js API
 ↓
Authentication
 ↓
Session
 ↓
Protected Application
```

Important:

> Authentication can be represented in the frontend, but authorization must always be enforced by the backend.

---

# 5. Application Structure

Initial routes:

```text
/login
/register

/app
  /chat
  /threads
  /expenses
  /settlements
  /settings
```

The exact routing structure can change later.

---

# 6. Conversation / Chat UI

The chat is the primary interface for interacting with the expense agent.

## Features

- [ ] Create thread
- [ ] List threads
- [ ] Open thread
- [ ] Display message history
- [ ] Send message
- [ ] Display assistant response
- [ ] Loading state
- [ ] Error state
- [ ] Empty state
- [ ] Resume existing conversation
- [ ] Upload receipt image
- [ ] Upload PDF
- [ ] Display uploaded files
- [ ] Display agent clarification questions
- [ ] Display expense confirmation

Flow:

```text
User
 ↓
Chat UI
 ↓
POST /threads/:threadId/messages
 ↓
Node.js Backend
 ↓
LangGraph
 ↓
Gemini
 ↓
Backend
 ↓
Assistant response
 ↓
Chat UI
```

---

# 7. Thread UI

Users should be able to see their existing conversations.

Example:

```text
Threads

Today
 ├── Paradise lunch
 ├── Grocery expense
 └── Dinner with Rahul

Yesterday
 ├── Office dinner
 └── Amazon purchase
```

Features:

- [ ] Create thread
- [ ] List threads
- [ ] Open thread
- [ ] Rename thread if needed
- [ ] Delete/archive thread if needed
- [ ] Display last activity
- [ ] Display thread status

Thread data belongs to the backend.

---

# 8. Receipt Upload

Support initially:

```text
image/jpeg
image/png
application/pdf
```

Flow:

```text
User selects receipt
        ↓
Frontend
        ↓
Upload API
        ↓
Backend
        ↓
Private object storage
        ↓
Agent processing
```

The frontend should not assume where the file is physically stored.

Do not expose private receipt files through public URLs.

---

# 9. Expense UI

Create an expense list.

Example:

```text
Expenses

₹1,240   Paradise
Food     Aug 24

₹850     Swiggy
Food     Aug 23

₹2,400   Amazon
Shopping Aug 21
```

Features:

- [ ] Expense list
- [ ] Expense details
- [ ] Merchant
- [ ] Date
- [ ] Amount
- [ ] Currency
- [ ] Category
- [ ] Items
- [ ] Participants
- [ ] Who paid
- [ ] Who owes
- [ ] Settlement status
- [ ] Basic filtering
- [ ] Basic search

---

# 10. Expense Details

Example:

```text
Paradise
24 August 2026

Total
₹1,240

Paid by
Harry

Items
-------------------------
Chicken Biryani     ₹300
Veg Biryani         ₹280
Chicken Noodles     ₹360
Drinks              ₹300

Participants
-------------------------
Harry               ₹360
Rahul               ₹300
Aman                ₹280
Vikram              ₹300
```

The frontend only displays the backend's calculated values.

Important:

> The frontend should not be responsible for financial calculations.

---

# 11. Settlement UI

Features:

- [ ] Show outstanding balances
- [ ] Show who owes whom
- [ ] Show amount
- [ ] Mark settlement
- [ ] Show settlement history

Example:

```text
You are owed

Rahul     ₹300
Aman      ₹280

Total     ₹580
```

---

# 12. Settings

Initial settings:

```text
Settings

Account
Integrations
Preferences
Security
```

Later:

```text
Notifications
Currency
Default expense preferences
Workspace
Members
```

Do not build every setting initially.

---

# 13. Slack Integration UI

Build after the basic expense workflow works.

Flow:

```text
Settings
   ↓
Integrations
   ↓
Slack
   ↓
Connect
   ↓
Select channel
   ↓
Choose message format
```

Possible formatting options:

```text
Default
Custom format
Let AI decide
```

The frontend only configures the integration.

The actual Slack credentials and API communication remain in the backend.

---

# 14. API Client Layer

Do not scatter raw `fetch()` calls across components.

Prefer:

```text
src/
  api/
    auth.ts
    threads.ts
    messages.ts
    expenses.ts
    settlements.ts
    integrations.ts
```

Example:

```ts
getThreads()
getThread(threadId)
sendMessage(threadId, message)
getExpenses()
getExpense(expenseId)
```

This keeps the frontend independent from the backend implementation.

---

# 15. TypeScript Types

Define types for API data.

Example:

```ts
interface Expense {
  id: string;
  merchant: string;
  total: number;
  currency: string;
}
```

Possible types:

```text
User
Thread
Message
Expense
ExpenseItem
Participant
Settlement
Integration
```

Ideally, API types should eventually be shared/generated from the backend contract rather than manually duplicated.

---

# 16. UI State

Every API-driven screen should consider:

```text
idle
loading
success
empty
error
```

Example:

```text
Loading expenses...
       ↓
Expenses loaded

OR

No expenses yet

OR

Failed to load expenses
```

Chat should also handle:

```text
sending
agent processing
agent response
agent error
uploading
upload error
```

---

# 17. State Management

Do not introduce a large state-management library immediately unless the application actually needs it.

Initially distinguish:

```text
Server state
    ↓
Data from backend

UI state
    ↓
Modal open/closed
Selected tab
Input value
Upload state

Authentication state
    ↓
Current user/session
```

Add a dedicated state-management solution only when complexity justifies it.

---

# 18. Frontend ↔ Backend Boundary

The frontend should think in terms of API contracts:

```text
Frontend
    ↓
API Request
    ↓
Backend
    ↓
Business Logic
    ↓
Database / Agent
    ↓
API Response
    ↓
Frontend
```

The frontend should not know:

```text
How Gemini works
How LangGraph works
How MongoDB is structured internally
How expense calculations are implemented
How Slack credentials are stored
```

---

# 19. Error Handling

Handle:

```text
400 → Invalid request
401 → Not authenticated
403 → Not authorized
404 → Resource not found
409 → Conflict
429 → Rate limited
500 → Server error
```

Display user-friendly messages.

Do not expose backend stack traces or sensitive information to users.

---

# 20. Vercel Deployment

Target deployment:

```text
GitHub
   ↓
Vercel
   ↓
Next.js
```

Environment variables:

```env
NEXT_PUBLIC_API_URL=...
```

Development:

```text
Next.js
   ↓
localhost backend
```

Production:

```text
Vercel
   ↓
Railway Node.js API
```

Later:

```text
Vercel
   ↓
AWS Node.js API
```

The frontend should not need major changes when Railway is replaced by AWS.

---

# 21. Future Flutter Compatibility

The backend API must remain frontend-agnostic.

Current:

```text
Next.js
    ↓
Node.js API
```

Future:

```text
                 ┌── Next.js
                 │
                 ├── Flutter
                 │
                 └── Future clients
                         ↓
                    Node.js API
```

This is one of the most important architectural decisions.

Do not put core business logic inside Next.js just because the first client is Next.js.

---

# 22. Suggested Folder Structure

This is a starting point, not a permanent rule.

```text
frontend/
│
├── src/
│   │
│   ├── app/
│   │   ├── login/
│   │   ├── register/
│   │   │
│   │   └── app/
│   │       ├── chat/
│   │       ├── threads/
│   │       ├── expenses/
│   │       ├── settlements/
│   │       └── settings/
│   │
│   ├── components/
│   │
│   ├── api/
│   │   ├── auth.ts
│   │   ├── threads.ts
│   │   ├── messages.ts
│   │   ├── expenses.ts
│   │   ├── settlements.ts
│   │   └── integrations.ts
│   │
│   ├── hooks/
│   │
│   ├── types/
│   │
│   ├── lib/
│   │
│   └── utils/
│
├── public/
│
├── package.json
├── tsconfig.json
└── .env.local
```

The structure can change as the project grows.

---

# 23. MVP Definition

The frontend MVP is complete when the user can:

```text
Register
   ↓
Login
   ↓
Create a thread
   ↓
Send a message
   ↓
Upload receipt
   ↓
See agent response
   ↓
Answer clarification questions
   ↓
Confirm expense
   ↓
View expense
   ↓
Close browser
   ↓
Login again
   ↓
Open same thread
   ↓
Continue conversation
```

---

# 24. Future Features

Potential later additions:

- [ ] Flutter mobile app
- [ ] Push notifications
- [ ] Offline support
- [ ] Real-time updates
- [ ] Advanced analytics
- [ ] Team/workspace UI
- [ ] Multiple integrations
- [ ] Expense search
- [ ] Advanced filtering
- [ ] Receipt preview
- [ ] Notifications
- [ ] Mobile-specific UX

These should be driven by actual product requirements.

---

# 25. Not Yet

Do NOT initially build:

- [ ] Flutter application
- [ ] Complex animations
- [ ] Advanced analytics dashboard
- [ ] Offline-first architecture
- [ ] Push notifications
- [ ] Complex state-management architecture
- [ ] Excessive component abstraction
- [ ] Premature performance optimization

First make the core workflow reliable.

---

# 26. Core Principle

> **The frontend is a client, not the application core.**

The architecture should allow:

```text
Next.js
   ↓
Node.js API
```

today, and:

```text
Next.js ──┐
          │
Flutter ──┼──→ Node.js API
          │
Future ───┘
```

tomorrow.

The frontend can evolve independently without forcing a rewrite of the backend, agent, database, or integrations.