/**
 * Avenue emblems.
 *
 * Each mark is an original, editorial illustration rather than a generic
 * interface glyph. The set shares a 64-unit drawing field, fine architectural
 * linework, and one restrained rose detail so it feels closer to a collection
 * of fashion-house seals than an icon library.
 */

interface IconArtwork {
  primary: JSX.Element
  detail: JSX.Element
  accent: JSX.Element
}

const ICONS = {
  hospitality: {
    primary: (
      <>
        <circle cx="22" cy="27" r="10" />
        <circle cx="22" cy="27" r="4" />
        <path d="m29.5 34.5 18 18M43 48l4-4M38.5 43.5l4-4" />
        <path d="M45.5 50.5 49 54l5-5-3.5-3.5" />
      </>
    ),
    detail: (
      <>
        <path d="M12 27c0-8.8 6.2-15 15-15M31 37l-4 4" />
        <path d="M9 52h19M12 56h13M18.5 44v8" />
      </>
    ),
    accent: (
      <>
        <path d="M45 12c.7 4.2 2.8 6.3 7 7-4.2.7-6.3 2.8-7 7-.7-4.2-2.8-6.3-7-7 4.2-.7 6.3-2.8 7-7Z" />
        <circle cx="13" cy="39" r="1.5" />
      </>
    ),
  },
  hotel: {
    primary: (
      <>
        <path d="M13 53V24l19-11 19 11v29" />
        <path d="M8 53h48" />
        <path d="M25 53V40a7 7 0 0 1 14 0v13" />
        <path d="M19 29h7v8h-7zM38 29h7v8h-7z" />
      </>
    ),
    detail: (
      <>
        <path d="M13 25h38M17 21h30M18 53V26M46 53V26" />
        <path d="M29 43h6M22.5 32.5h0M41.5 32.5h0" />
      </>
    ),
    accent: (
      <>
        <path d="M32 7v9M27.5 11.5h9" />
        <circle cx="32" cy="11.5" r="1.6" />
      </>
    ),
  },
  restaurant: {
    primary: (
      <>
        <path d="M15 43c1.7-11 8-17 17-17s15.3 6 17 17" />
        <path d="M11 43h42M8 49h48" />
        <path d="M28 25a4 4 0 0 1 8 0" />
      </>
    ),
    detail: (
      <>
        <path d="M18 39c3.2-6.3 7.8-9.5 14-9.5S42.8 32.7 46 39" />
        <path d="M18 53h28M22 49v4M42 49v4" />
        <path d="M23 20c-2.6-2.7-2.6-5.4 0-8M32 18c-2.6-2.7-2.6-5.4 0-8" />
      </>
    ),
    accent: (
      <path d="M43 19c.5 2.8 1.8 4.1 4.6 4.6-2.8.5-4.1 1.8-4.6 4.6-.5-2.8-1.8-4.1-4.6-4.6 2.8-.5 4.1-1.8 4.6-4.6Z" />
    ),
  },
  fashion: {
    primary: (
      <>
        <path d="M28 13c0 3.3 1.3 5 4 5s4-1.7 4-5" />
        <path d="M25 20c1.5 4.5 1 8.5-1.5 12L17 46h30l-6.5-14C38 28.5 37.5 24.5 39 20" />
        <path d="M25 20c4.6 2 9.4 2 14 0M32 46v10M25 57h14" />
      </>
    ),
    detail: (
      <>
        <path d="M32 22v24M24 32c5.3 2.4 10.7 2.4 16 0" />
        <path d="M21 42c7.3 2.7 14.7 2.7 22 0M28 13V9h8v4" />
      </>
    ),
    accent: (
      <>
        <circle cx="32" cy="28" r="2.2" />
        <path d="M29.8 28h4.4M32 25.8v4.4" />
      </>
    ),
  },
  beauty: {
    primary: (
      <>
        <path d="M22 29c0-4 3.2-7.2 7.2-7.2h5.6c4 0 7.2 3.2 7.2 7.2v22H22V29Z" />
        <path d="M26 21.8V15h12v6.8M24 15h16M27 10h10v5" />
        <path d="M22 34h20M22 47h20" />
      </>
    ),
    detail: (
      <>
        <path d="M26 38.5h12v5H26zM27 51v3M37 51v3" />
        <path d="M40 17h7M47 17v6M47 20h5" />
      </>
    ),
    accent: (
      <>
        <path d="M15 19c.6 3.4 2.2 5 5.6 5.6-3.4.6-5 2.2-5.6 5.6-.6-3.4-2.2-5-5.6-5.6 3.4-.6 5-2.2 5.6-5.6Z" />
        <circle cx="32" cy="41" r="1.4" />
      </>
    ),
  },
  lifestyle: {
    primary: (
      <>
        <circle cx="32" cy="32" r="13" />
        <path d="M32 8v8M32 48v8M8 32h8M48 32h8" />
        <path d="m15 15 5.5 5.5M43.5 43.5 49 49M49 15l-5.5 5.5M20.5 43.5 15 49" />
      </>
    ),
    detail: (
      <>
        <ellipse cx="32" cy="32" rx="25" ry="9" transform="rotate(-24 32 32)" />
        <path d="M32 22c1 6 4 9 10 10-6 1-9 4-10 10-1-6-4-9-10-10 6-1 9-4 10-10Z" />
      </>
    ),
    accent: (
      <>
        <circle cx="50.5" cy="21.5" r="2.2" />
        <circle cx="13.5" cy="42.5" r="1.3" />
      </>
    ),
  },
  realEstate: {
    primary: (
      <>
        <path d="M10 54V34l13-7v27M23 54V17L39 9v45M39 54V27l15 7v20" />
        <path d="M6 54h52" />
        <path d="M28 51V22l6-3v32" />
      </>
    ),
    detail: (
      <>
        <path d="M14 37h5M14 42h5M14 47h5M44 34h6M44 40h6M44 46h6" />
        <path d="M28 28h6M28 35h6M28 42h6M8 58h48" />
      </>
    ),
    accent: (
      <>
        <path d="M39 9v11M34.5 14.5h9" />
        <circle cx="39" cy="14.5" r="1.5" />
      </>
    ),
  },
} satisfies Record<string, IconArtwork>

export type IconName = keyof typeof ICONS

export default function Icon({ name, size = 58 }: { name: IconName; size?: number }) {
  const artwork = ICONS[name]

  return (
    <svg
      className="avenue-icon"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g className="avenue-icon__primary">{artwork.primary}</g>
      <g className="avenue-icon__detail">{artwork.detail}</g>
      <g className="avenue-icon__accent">{artwork.accent}</g>
    </svg>
  )
}
