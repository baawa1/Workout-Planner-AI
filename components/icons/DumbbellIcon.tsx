
import React from 'react';

export const DumbbellIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14.4 14.4 9.6 9.6" />
    <path d="M18.657 5.343a2 2 0 1 0-2.829-2.828" />
    <path d="M17.24 6.757 13 11" />
    <path d="m5.343 18.657 2.829 2.829a2 2 0 0 0 2.828 0l2.829-2.829" />
    <path d="M6.757 17.24 11 13" />
    <path d="m18.657 18.657-2.829-2.829a2 2 0 0 0-2.828 0l-2.829 2.829" />
    <path d="m5.343 5.343 2.829 2.829a2 2 0 0 0 2.828 0l2.829-2.829" />
  </svg>
);
