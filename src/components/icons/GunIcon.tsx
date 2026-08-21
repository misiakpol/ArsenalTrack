import React from "react";

export default function GunIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      // 1. Removed hardcoded width="682..." and height="682..." so Tailwind can size it
      viewBox="0 0 682.66669 682.66669"
      // 2. Injected your Tailwind classes
      className={className}
    >
      <defs>
        {/* 3. Changed HTML 'clip-path' to React camelCase 'clipPath' */}
        <clipPath clipPathUnits="userSpaceOnUse" id="clipPath1586">
          <path d="M 0,512 H 512 V 0 H 0 Z" />
        </clipPath>
      </defs>

      <g transform="matrix(1.3333333,0,0,-1.3333333,0,682.66667)">
        <g clipPath="url(#clipPath1586)">
          <g transform="translate(288.1338,272.0669)">
            {/* 4. Converted inline style="..." into React props and swapped #000000 for currentColor */}
            <path
              d="m 0,0 v -8.034 c 0,-39.933 -32.367,-72.299 -72.3,-72.299 h -44.184"
              fill="none"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
          </g>

          <g transform="translate(15,288.1333)">
            <path
              d="M 0,0 V 48.2 H 482 V -16.066 H 201.821 c -14.741,0 -27.594,-10.034 -31.169,-24.342 -12.965,-51.839 -42.119,-168.459 -42.119,-168.459 H 0 c 0,42.167 10.612,83.651 30.864,120.637 3.382,6.162 6.844,12.484 10.291,18.782 7.961,14.532 7.663,32.189 -0.787,46.448 C 31.917,-8.74 16.581,0 0.008,0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
          </g>

          <g transform="translate(497,416.6665)">
            <path
              d="M 0,0 H -176.733 L -192.8,-16.066 h -80.333 L -289.2,0 H -482 V -80.333 H 0 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
          </g>

          <g transform="translate(480.9336,416.6665)">
            <path
              d="M 0,0 V 16.067"
              fill="none"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
          </g>

          <g transform="translate(63.2002,416.6665)">
            <path
              d="M 0,0 V 16.067"
              fill="none"
              stroke="currentColor"
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeMiterlimit="10"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}
