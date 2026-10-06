/**
 * Line-art industry icons.
 *
 * These replace emoji (🏨 👗 ✨ 🍽), which render as a different picture on
 * every operating system, carry their own colour palette, and read as
 * placeholder art on a premium brand. Drawn on a 24-unit grid with a single
 * stroke weight so they sit together as a set.
 */

const PATHS: Record<string, JSX.Element> = {
  // Wide building with an awning and a doorway.
  hotel: (
    <>
      <path d="M4 21V7.5L12 4l8 3.5V21" />
      <path d="M2.5 21h19" />
      <path d="M10 21v-4.5a2 2 0 0 1 4 0V21" />
      <path d="M7.5 10.5h2M14.5 10.5h2M7.5 13.5h2M14.5 13.5h2" />
    </>
  ),
  // Fork and knife.
  restaurant: (
    <>
      <path d="M7 3v7a2.5 2.5 0 0 0 2.5 2.5h0V21" />
      <path d="M7 3v5M9.5 3v5M12 3v5" />
      <path d="M17.5 3c1.4 1.6 1.9 3.6 1.5 6-.3 1.7-1 2.6-1.5 3v9" />
    </>
  ),
  // Clothes hanger.
  fashion: (
    <>
      <path d="M12 8.5V7a2 2 0 1 1 2-2" />
      <path d="M12 8.5 3.5 15.2a1.2 1.2 0 0 0 .75 2.15h15.5a1.2 1.2 0 0 0 .75-2.15L12 8.5Z" />
    </>
  ),
  // Droplet with a highlight.
  beauty: (
    <>
      <path d="M12 3.5c3.4 4 5.5 6.8 5.5 9.8a5.5 5.5 0 0 1-11 0c0-3 2.1-5.8 5.5-9.8Z" />
      <path d="M9.5 14a2.6 2.6 0 0 0 2.5 2.6" />
    </>
  ),
  // Four-point radiant.
  lifestyle: (
    <>
      <path d="M12 2.5c.9 5.2 3.4 7.7 8.6 8.6-5.2.9-7.7 3.4-8.6 8.6-.9-5.2-3.4-7.7-8.6-8.6 5.2-.9 7.7-3.4 8.6-8.6Z" />
    </>
  ),
  // Stepped tower.
  realEstate: (
    <>
      <path d="M3 21V11l5-2.5V21" />
      <path d="M8 21V4.5L16 2v19" />
      <path d="M16 21v-8l5 2.5V21" />
      <path d="M1.5 21h21" />
      <path d="M11 7.5h2M11 11h2M11 14.5h2" />
    </>
  ),
}

export type IconName = keyof typeof PATHS

export default function Icon({ name, size = 30 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.15}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[name]}
    </svg>
  )
}
