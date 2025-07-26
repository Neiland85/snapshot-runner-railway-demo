# 🧭 Railway Navigation Component - V0.dev Prompt

## 🎯 Prompt Específico para Navegación Avanzada

### Railway-Style Navigation Hub con Back Navigation

```text
Create a comprehensive navigation system for a Railway-inspired security dashboard with advanced routing capabilities:

MAIN NAVIGATION STRUCTURE:
- Top horizontal navigation bar with Railway's signature dark theme (#0F0F23)
- Primary sections: Dashboard, Security, Dependencies, Comparison
- Each section with Railway purple (#A855F7) active states and smooth transitions
- Glassmorphism effect with backdrop-blur and subtle purple glows

NAVIGATION COMPONENTS DESIGN:
- Tab-style navigation with animated sliding indicator
- Active tab: Purple glow (#A855F7), bold text, animated underline
- Inactive tabs: Muted gray (#64748B) with hover brightening effects
- Smooth 300ms transitions between all states
- Modern rounded corners and shadow effects

BACK NAVIGATION SYSTEM:
- "Back to Dependencies" button with left arrow icon
- Positioned prominently in page header or breadcrumb area
- Styled with Railway's glassmorphism aesthetic
- Hover effects with scale and color transitions
- Clear visual hierarchy and accessibility support

BREADCRUMB IMPLEMENTATION:
- Dynamic breadcrumb trail: Home > Security > Dependencies > Current Page
- Clickable breadcrumb segments with hover animations
- Purple separator icons and navigation indicators
- Responsive design that adapts to screen size
- Smart truncation for long navigation paths

ROUTING FUNCTIONALITY:
- Client-side routing with URL updates
- Deep linking support for direct section access
- Browser back/forward button integration
- Programmatic navigation between sections
- State preservation during navigation

INTERACTIVE FEATURES:
- Smooth page transitions with fade/slide animations
- Loading states with Railway-themed skeletons
- Error boundaries for failed navigation
- Keyboard shortcuts for power users (Ctrl+1-4 for sections)
- Touch gestures for mobile navigation

MOBILE RESPONSIVE DESIGN:
- Collapsible hamburger menu for mobile
- Bottom navigation bar alternative
- Swipe gestures between sections
- Touch-optimized button sizes (min 44px)
- Adaptive layout for tablet and phone

ADVANCED FEATURES:
- Section-specific sub-navigation menus
- Quick access shortcuts and favorites
- Search functionality within navigation
- Recently visited sections history
- User preference persistence for navigation layout

TECHNICAL IMPLEMENTATION:
- React Router v6 integration
- TypeScript interfaces for navigation state
- Custom hooks for navigation management
- Accessibility compliance (WCAG 2.1 AA)
- Performance optimization with code splitting

STYLING SPECIFICATIONS:
- Background: #0F0F23 (Railway dark)
- Primary: #A855F7 (Railway purple)
- Text: #F8FAFC (light) / #64748B (muted)
- Glassmorphism: backdrop-blur-md with border-white/10
- Shadows: shadow-lg with purple-tinted glows
- Animations: smooth 300ms ease-in-out transitions

Create a navigation system that feels like a premium enterprise platform with Railway's signature design language and intuitive user experience.
```

## 🔧 Implementation Notes

### Key Components to Include

1. **NavigationBar Component**
   - Main horizontal navigation
   - Active state management
   - Smooth transitions

2. **BackButton Component**
   - "Back to Dependencies" functionality
   - Context-aware back navigation
   - Consistent styling

3. **Breadcrumb Component**
   - Dynamic path display
   - Clickable navigation segments
   - Responsive truncation

4. **MobileNavigation Component**
   - Hamburger menu
   - Drawer/sidebar navigation
   - Touch-optimized interactions

### Usage Example

```typescript
<NavigationHub 
  currentSection="security"
  backTo="dependencies"
  breadcrumb={["Home", "Security", "Dependencies"]}
  onNavigate={(section) => navigate(section)}
  mobile={isMobile}
/>
```

¡Usa este prompt en V0.dev para crear una navegación perfecta con el estilo Railway!
