# Split Money Frontend

Modern, mobile-first Single Page Application for **Tandem / Split Money**, built with React 19, Vite, React Router v7, Lucide Icons, and Vanilla CSS with custom glassmorphism.

---

## 📁 Directory Structure

```text
split-money-frontend/
├── public/
│   ├── favicon.svg               # App brand favicon
│   └── icons.svg                 # SVG sprite sheet
├── src/
│   ├── assets/                   # Static graphics & illustrations
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx        # Reusable styled button with variants
│   │   │   ├── ConfirmDialog.jsx # Confirmation modal for sensitive actions
│   │   │   ├── MemberAvatar.jsx  # Member avatar with initials & color hashing
│   │   │   └── Modal.jsx         # Accessible base modal overlay
│   │   ├── dashboard/
│   │   │   ├── MobileDashboardView.jsx # Dedicated mobile-optimized dashboard view
│   │   │   └── OroveraMascot.jsx # Interactive 8-bit mascot illustrations
│   │   ├── expenses/
│   │   │   ├── AddExpenseModal.jsx     # New split modal with multi-split modes
│   │   │   └── ExpenseDetailModal.jsx  # Itemized breakdown & delete modal
│   │   ├── groups/
│   │   │   ├── CreateGroupModal.jsx    # Group creation modal
│   │   │   ├── GroupBillPreviewModal.jsx# Live socket-triggered bill confirmation
│   │   │   └── InviteMemberModal.jsx   # Member invitation & lookup modal
│   │   ├── layout/
│   │   │   ├── AppLayout.jsx     # Master layout container & broadcast listener
│   │   │   ├── Footer.jsx        # Responsive watermark & desktop footer
│   │   │   ├── MobileDrawer.jsx  # Full mobile hamburger drawer
│   │   │   ├── MobileNav.jsx     # 3-tab bottom navigation (Home, Groups, Profile)
│   │   │   └── Topbar.jsx        # Floating transparent glass navbar with theme picker
│   │   ├── notifications/
│   │   │   └── NotificationDropdown.jsx # Real-time notification drawer
│   │   └── settlements/
│   │       └── SettleDebtModal.jsx# Gateway-free UPI payment & QR modal
│   ├── context/
│   │   ├── AuthContext.jsx       # User auth state, token storage & session handling
│   │   ├── ExpenseGroupContext.jsx# Active group, shared balances & expenses
│   │   ├── NotificationContext.jsx# Real-time notifications & unread counts
│   │   ├── SocketContext.jsx     # Socket.IO connection & event dispatching
│   │   └── ThemeContext.jsx      # Light/dark mode & 9 dynamic accent themes
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── ForgotPasswordPage.jsx
│   │   │   ├── LoginPage.jsx     # Sign-in with session caching
│   │   │   └── RegisterPage.jsx  # User registration
│   │   ├── ActivityPage.jsx      # Audit timeline & historical transactions
│   │   ├── CollabInvitePage.jsx  # Group invitation landing
│   │   ├── DashboardPage.jsx     # Main financial command center
│   │   ├── GroupDetailPage.jsx   # Group expenses, balances & settlement hub
│   │   ├── GroupsPage.jsx        # Envelopes & active trips overview
│   │   ├── LandingPage.jsx       # Public landing page
│   │   ├── NotificationsPage.jsx # Full-screen notification inbox
│   │   ├── ProfilePage.jsx       # Account settings, stats & UPI ID management
│   │   └── SettlementsPage.jsx   # Cross-group net debt settlement center
│   ├── services/
│   │   ├── api.js                # Axios instance with seamless 401 token refresh
│   │   ├── auth.service.js       # Auth API client
│   │   ├── expense.service.js    # Expenses API client
│   │   ├── group.service.js      # Groups API client
│   │   ├── notification.service.js# Notifications API client
│   │   └── settlement.service.js # Settlements & UPI intents API client
│   ├── utils/
│   │   ├── formatters.js         # Currency (₹/INR), date & relative time helpers
│   │   └── upiHelper.js          # Client-side UPI URL & deep-linking utilities
│   ├── App.jsx                   # Route hierarchy & protection wrappers
│   ├── index.css                 # Global CSS tokens, resets & typography
│   └── main.jsx                  # React application entry point
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🎨 Dynamic Multi-Color Theme Engine

Tandem features an advanced client-side theme engine configured in `src/context/ThemeContext.jsx`:

### 1. Light & Dark Mode
- Smooth transitions across all components, cards, navigation, and modals.
- Persisted automatically to `localStorage` under `split_money_theme`.

### 2. 9 Curated Accent Presets
Choose any theme from the topbar palette icon (`🎨`):

| Theme ID | Name | Type | Highlights |
| :--- | :--- | :--- | :--- |
| `amber` | **Solar Gold** | Vibrant Solid | Warm sunlit yellow with amber glows |
| `emerald`| **Emerald Jade** | Vibrant Solid | Crisp financial emerald and forest green |
| `indigo` | **Electric Indigo** | Vibrant Solid | Modern deep purple-blue fintech aesthetic |
| `cyan` | **Neon Cyan** | Vibrant Solid | High-tech teal and bright aqua |
| `violet` | **Royal Violet** | Vibrant Solid | Luxury purple and lavender sheen |
| `rose` | **Sunset Rose** | Vibrant Solid | Energetic crimson and warm coral |
| `prism` | **Prism Aurora** | **Multi-Color** | Iridescent pastel blend of cotton candy pink, electric lavender, sky cyan, and golden lemon |
| `cyberpunk`| **Cyberpunk Neon**| **Multi-Color** | High-energy synthwave blend of electric cyan, ultra-violet indigo, and hot magenta |
| `twilight` | **Cosmic Twilight**| **Multi-Color** | Warm dusk gradient of sunset orange, rose fuchsia, galaxy violet, and midnight cobalt |

---

## 📱 Mobile-First UI Features

1. **Floating Transparent Navbar ([Topbar.jsx](file:///c:/Users/Abhinav%20Pandey/Desktop/moneyspliter/split-money-frontend/src/components/layout/Topbar.jsx))**:
   - Zero background boundaries on the dashboard.
   - Sits directly over the hero gradient so theme colors flow seamlessly from the very top pixel of the screen.
   - Frosted glass floating capsule pills (`tandem` logo, Dark mode toggle, Palette picker, Hamburger menu).

2. **3-Button Bottom Navigation ([MobileNav.jsx](file:///c:/Users/Abhinav%20Pandey/Desktop/moneyspliter/split-money-frontend/src/components/layout/MobileNav.jsx))**:
   - **Home** (`/dashboard`): Visual balance overview and transactions.
   - **Groups** (`/groups`): Multi-group envelopes and shared trips.
   - **Profile** (`/profile`): Personal profile, UPI ID management, and theme stats.

3. **Dashboard Quick Action Row**:
   - **+ Add Expense**: Opens split expense modal.
   - **Settle Up**: Direct peer-to-peer settlement hub.
   - **New Group**: Quick trip/envelope creator.
   - **Activity**: Live audit log and transaction feed.

4. **Organic Snake Wave**:
   - Multi-layer undulating wave SVG that separates the upper hero balance section from the lower transaction feed.
   - Features peeking interactive mascot sitting along the crest of the wave.

---

## 💳 Gateway-Free UPI Payment Integration

The settlement modal ([SettleDebtModal.jsx](file:///c:/Users/Abhinav%20Pandey/Desktop/moneyspliter/split-money-frontend/src/components/settlements/SettleDebtModal.jsx)) enables zero-fee peer-to-peer UPI payments:

1. **Direct Deep-Linking**: On mobile devices, clicking **Pay via UPI** triggers standard intent URLs (`upi://pay?pa=...`) that automatically launch Google Pay, PhonePe, Paytm, or BHIM.
2. **Interactive QR Code**: On desktop or cross-device payments, displays dynamic high-resolution QR codes via `qrcode.react`.
3. **P2P Confirmation Workflow**:
   - Debtor marks payment as paid (optionally providing UPI Reference / UTR).
   - Real-time notification is broadcast to the recipient.
   - Recipient verifies funds and clicks **Confirm Received**.
   - Triggers celebratory confetti animation via `canvas-confetti`.

---

## ⚙️ Development & Scripts

```bash
# Install dependencies
npm install

# Start development server with Hot Module Replacement (HMR)
npm run dev

# Run fast code linting via Oxlint
npm run lint

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
