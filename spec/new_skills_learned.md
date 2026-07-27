# New Skills & Design Architectural Lessons Learned

## 🧠 Architectural & UX Best Practices Captured

### 1. Dual-Market Dynamic Currency Synchronization in Next.js Checkout
- **Context**: When supporting localized payment gateways (e.g. Nepal Domestic eSewa, Khalti, Fonepay vs International Card, PayPal), gateway tabs must synchronize the active currency context dynamically.
- **Pattern**:
  ```tsx
  // Dynamic order total display based on selected market region
  const displayTotalFormatted = regionTab === "nepal"
    ? `NPR ${nprAmount.toLocaleString()}`
    : formatPrice(subtotal);
  ```
- **Rule**: Never show a mismatched currency (e.g. €245) when a domestic wallet prompt explicitly states an amount in local currency (e.g. NPR 35,525).

### 2. Header Clearance & Announcement Bar Layout Shifts
- **Context**: Fixed headers with optional dismissible announcement bars cause layout clearance issues if subpage top padding is static.
- **Pattern**: `<PageShell />` wrapper uses top padding `pt-[96px] sm:pt-[110px] md:pt-[120px]` so subpage hero headings are never obscured regardless of announcement bar toggle state.

### 3. Glassmorphic Surface Elevation & Contrast Standards (`AGENTS.md`)
- **Base Surface**: `#030305`
- **Elevated Glass Card**: `bg-[#0a0a0c]/90 border border-white/15 backdrop-blur-2xl shadow-2xl`
- **Focus Rings**: `focus:border-[#00D2FF] shadow-[0_0_15px_rgba(0,210,255,0.15)]`
- **Tactile Feedback**: `active:scale-95 transition-all` on interactive controls.
