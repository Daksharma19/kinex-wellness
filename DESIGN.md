# Design System Documentation: Kinex Healthcare

## 1. Overview & Creative North Star: "The Clinical Sanctuary"

The digital landscape for healthcare is often cluttered, cold, or overly clinical. This design system departs from the "standard dashboard" aesthetic to embrace **The Clinical Sanctuary**. This North Star defines a space that is as authoritative as a medical institution but as calming as a high-end wellness retreat.

We achieve this through **Atmospheric Minimalist** principles. Instead of rigid boxes and heavy dividers, we use intentional white space, tonal layering, and "breathable" typography. The goal is to reduce cognitive load for patients and providers alike, using asymmetry to guide the eye and subtle depth to signify importance. This is not just a platform; it is a premium service environment.

---

### 2. Colors & Tonal Logic

Color in this system is used as a functional beacon. We prioritize a "Teal-on-Neutral" palette to maintain professional trust while injecting vitality.

#### The "No-Line" Rule
**Strict Mandate:** Traditional 1px solid borders are prohibited for sectioning. 
Visual boundaries must be created through:
*   **Background Shifts:** Placing a `surface_container_low` section against a `background` floor.
*   **Tonal Transitions:** Using the hierarchy of surfaces to define edge-cases without a "stroke."

#### Surface Hierarchy & Nesting
Treat the interface as a physical stack of premium materials.
*   **Base Layer:** `background` (#f8f9fa).
*   **Secondary Content Areas:** `surface_container_low` (#f3f4f5).
*   **Interactive/Priority Cards:** `surface_container_lowest` (#ffffff).
*   **Overlays/Modals:** `surface_bright` (#f8f9fa) with Glassmorphism.

#### The "Glass & Signature" Rule
To elevate the "Modern" requirement, use **Glassmorphism** for navigation bars and floating action panels.
*   **Recipe:** `surface_container_lowest` at 80% opacity + 20px Backdrop Blur.
*   **Signature Textures:** Use a subtle radial gradient on Hero CTAs: `primary` (#00595c) transitioning to `primary_container` (#0d7377) at a 45-degree angle. This adds "soul" and depth to flat surfaces.

---

### 3. Typography: Editorial Authority

We use **Inter** for its mathematical precision and exceptional legibility at small sizes. The hierarchy is designed to feel like a high-end editorial journal.

*   **Display & Headlines:** Use `display-lg` and `headline-md` to create clear entry points. These should be set with tight letter-spacing (-0.02em) to feel "custom" and authoritative.
*   **The Body Paradox:** While the prompt suggests "Light Grey" for body text, we utilize `on_surface_variant` (#3e4949) for long-form reading to ensure WCAG AA accessibility while maintaining a softer, premium aesthetic compared to pure black.
*   **Labeling:** `label-md` and `label-sm` should always be in All-Caps with +0.05em tracking when used for category headers or metadata to distinguish them from interactive text.

---

### 4. Elevation & Depth: Tonal Layering

We move away from "drop shadows as a default" toward **Ambient Depth**.

*   **The Layering Principle:** A `surface_container_lowest` card placed on a `surface_container` background creates an immediate, soft lift. This is our primary method of organization.
*   **Ambient Shadows:** Where floating is required (e.g., a primary action card), use:
    *   **Blur:** 32px to 48px.
    *   **Opacity:** 4% - 6%.
    *   **Color:** Use a tinted shadow (`on_surface` at low opacity) rather than grey to ensure the shadow feels like a natural light obstruction.
*   **The "Ghost Border" Fallback:** If a container requires further definition (e.g., a search input), use `outline_variant` (#bec9c9) at **15% opacity**. Never 100%.

---

### 5. Components

#### Buttons
*   **Primary:** `primary_container` (#0d7377) background with `on_primary` text. Use `md` (12px) corner radius.
*   **Secondary:** `surface_container_high` background with `primary` text. No border.
*   **Tertiary:** Transparent background, `primary` text, with a 2px underline appearing only on hover.

#### Cards & Lists
*   **Rule:** Forbid divider lines.
*   **Implementation:** Separate list items using 12px of vertical white space or by alternating background tones (`surface` to `surface_container_low`). 
*   **Radius:** Cards must use `lg` (1rem/16px) for a soft, modern feel, exceeding the standard 8px to emphasize the "Sanctuary" vibe.

#### Input Fields
*   **Style:** Minimalist under-layer. Instead of a box, use a `surface_container_low` background with a slightly darker `outline_variant` (20% opacity) bottom-stroke that transitions to a 2px `primary` stroke on focus.

#### Contextual Healthcare Components
*   **Vitality Chips:** Use `secondary_container` for non-urgent patient data and `error_container` for alerts.
*   **Progressive Disclosure Trays:** Instead of standard accordions, use "Sliding Sheets" that utilize the `surface_container_highest` tier to indicate they are temporary overlays.

---

### 6. Do's and Don'ts

#### Do
*   **Do** use intentional asymmetry. Align a headline to the left but offset the body text to create a more sophisticated, "non-templated" grid.
*   **Do** use `primary` (#00595c) for medical data points to imbue them with importance and trust.
*   **Do** prioritize "Breathing Room." If you think there is enough margin, add 8px more.

#### Don't
*   **Don't** use pure black (#000000) for text. It creates too much "vibration" against white backgrounds. Use `on_surface`.
*   **Don't** use 100% opaque borders. They trap the eye and make the platform feel like a legacy database.
*   **Don't** use standard "Blue" for links. Use the Teal `primary` to maintain brand cohesion.