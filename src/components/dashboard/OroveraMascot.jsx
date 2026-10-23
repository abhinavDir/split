import React from 'react';

/**
 * Orovera Mascot (Upper-right of Golden Hero Card)
 * Exactly matches reference image:
 * - Bright yellow rounded monster body
 * - Blue tuft/crest on head
 * - Two big round white cartoon eyes
 * - 8-bit black pixel cool sunglasses with white glare pixels
 * - Stubby little arms & feet
 * - White belly patch with blue QR code badge
 */
export function OroveraMascot({ size = 110, style = {} }) {
  return (
    <svg
      width={size}
      height={size * 1.15}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 8px 18px rgba(0,0,0,0.18))', ...style }}
    >
      {/* Blue spiky hair crest/tuft */}
      <path
        d="M60 12 C58 4 66 -2 71 4 C76 -1 82 4 80 12 C86 8 91 14 86 20 C80 24 70 25 60 16 Z"
        fill="#0284c7"
        stroke="#0f172a"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Main Yellow Chubby Monster Body */}
      <path
        d="M32 46 C24 72 20 100 26 118 C30 128 48 130 60 130 C72 130 90 128 94 118 C100 100 96 72 88 46 C84 28 36 28 32 46 Z"
        fill="#ffe082"
        stroke="#0f172a"
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Two Big Round White Cartoon Eyes on Top of Head */}
      <circle cx="44" cy="38" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
      <circle cx="76" cy="38" r="14" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
      {/* Black Pupils */}
      <circle cx="44" cy="36" r="5" fill="#0f172a" />
      <circle cx="76" cy="36" r="5" fill="#0f172a" />
      {/* Little White Pupil Glints */}
      <circle cx="42" cy="34" r="1.5" fill="#ffffff" />
      <circle cx="74" cy="34" r="1.5" fill="#ffffff" />

      {/* Little Feet */}
      <path
        d="M36 128 C34 135 42 138 48 135 C52 133 50 128 46 127 Z"
        fill="#ffd54f"
        stroke="#0f172a"
        strokeWidth="2.5"
      />
      <path
        d="M74 127 C70 128 68 133 72 135 C78 138 86 135 84 128 Z"
        fill="#ffd54f"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* Little Arms by Side */}
      <path
        d="M26 68 C16 74 14 86 22 90 C26 86 28 78 28 72 Z"
        fill="#ffd54f"
        stroke="#0f172a"
        strokeWidth="2.5"
      />
      <path
        d="M94 72 C94 78 96 86 100 90 C108 86 106 74 96 68 Z"
        fill="#ffd54f"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* 8-Bit Pixel Cool Sunglasses (Sitting over the eyes) */}
      {/* Left Lens */}
      <rect x="26" y="38" width="30" height="18" rx="2" fill="#000000" />
      {/* Right Lens */}
      <rect x="64" y="38" width="30" height="18" rx="2" fill="#000000" />
      {/* Center Pixel Bridge */}
      <rect x="54" y="44" width="12" height="6" fill="#000000" />

      {/* Pixel White Glare Glints on Sunglasses */}
      {/* Left Glare */}
      <rect x="30" y="42" width="5" height="4" fill="#ffffff" />
      <rect x="35" y="46" width="5" height="4" fill="#ffffff" />
      {/* Right Glare */}
      <rect x="68" y="42" width="5" height="4" fill="#ffffff" />
      <rect x="73" y="46" width="5" height="4" fill="#ffffff" />

      {/* White Belly Patch */}
      <ellipse cx="60" cy="94" rx="20" ry="22" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1.5" />

      {/* Blue QR Code Box on Belly */}
      <rect
        x="49"
        y="83"
        width="22"
        height="22"
        rx="3"
        fill="#ffffff"
        stroke="#0284c7"
        strokeWidth="2"
      />
      {/* QR Code Pixel Modules */}
      <rect x="52" y="86" width="6" height="6" fill="#0284c7" />
      <rect x="54" y="88" width="2" height="2" fill="#ffffff" />

      <rect x="62" y="86" width="6" height="6" fill="#0284c7" />
      <rect x="64" y="88" width="2" height="2" fill="#ffffff" />

      <rect x="52" y="96" width="6" height="6" fill="#0284c7" />
      <rect x="54" y="98" width="2" height="2" fill="#ffffff" />

      <rect x="62" y="96" width="3" height="3" fill="#0284c7" />
      <rect x="65" y="99" width="3" height="3" fill="#0284c7" />
      <rect x="59" y="92" width="2" height="4" fill="#0284c7" />
    </svg>
  );
}

/**
 * Peek Mascot (Peeking over the center wave)
 * Exactly matches reference image:
 * - Small yellow monster peeking with hands grasping the edge
 * - Big round surprised eyes ( ⊙ o ⊙ )
 * - Open mouth
 * - Blue hair tuft
 * - QR badge on chest
 */
export function PeekMascot({ size = 56, style = {} }) {
  return (
    <svg
      width={size}
      height={size * 0.85}
      viewBox="0 0 70 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.2))', ...style }}
    >
      {/* Blue hair crest */}
      <path
        d="M35 6 C33 1 38 -2 41 2 C44 -1 48 3 46 8 C50 5 53 9 50 14 C46 17 40 18 35 12 Z"
        fill="#0284c7"
        stroke="#0f172a"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Head & Body */}
      <path
        d="M20 28 C18 42 16 54 22 58 C26 60 44 60 48 58 C54 54 52 42 50 28 C48 18 22 18 20 28 Z"
        fill="#ffe082"
        stroke="#0f172a"
        strokeWidth="2.5"
      />

      {/* Two Big Round Cartoon Eyes */}
      <circle cx="28" cy="24" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
      <circle cx="42" cy="24" r="8" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
      {/* Pupils */}
      <circle cx="28" cy="24" r="3" fill="#0f172a" />
      <circle cx="42" cy="24" r="3" fill="#0f172a" />
      <circle cx="27" cy="23" r="1" fill="#ffffff" />
      <circle cx="41" cy="23" r="1" fill="#ffffff" />

      {/* Surprised Open Mouth ( ⊙ o ⊙ ) */}
      <ellipse cx="35" cy="33" rx="3" ry="3.5" fill="#0f172a" />

      {/* White Belly Patch with QR badge */}
      <ellipse cx="35" cy="46" rx="10" ry="10" fill="#ffffff" />
      <rect x="30" y="42" width="10" height="10" rx="1.5" fill="#ffffff" stroke="#0284c7" strokeWidth="1.2" />
      <rect x="32" y="44" width="3" height="3" fill="#0284c7" />
      <rect x="36" y="44" width="3" height="3" fill="#0284c7" />
      <rect x="32" y="48" width="3" height="3" fill="#0284c7" />
      <rect x="36" y="48" width="2" height="2" fill="#0284c7" />

      {/* Hands Grasping the Edge \\__( ⊙ o ⊙ )__/ */}
      <ellipse cx="16" cy="38" rx="4" ry="3" fill="#ffd54f" stroke="#0f172a" strokeWidth="2" />
      <ellipse cx="54" cy="38" rx="4" ry="3" fill="#ffd54f" stroke="#0f172a" strokeWidth="2" />
    </svg>
  );
}
