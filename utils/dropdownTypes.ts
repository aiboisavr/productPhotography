export type themeType =
  | "Modern"
  | "Vintage"
  | "Minimalist"
  | "Professional"
  | "Tropical";

export type roomType =
  | "Living Room"
  | "Dining Room"
  | "Bedroom"
  | "Bathroom"
  | "Office"
  | "Gaming Room";

export const themes: themeType[] = [
  "Modern",
  "Minimalist",
  "Professional",
  "Tropical",
  "Vintage",
];
export const rooms: roomType[] = [
  "Living Room",
  "Dining Room",
  "Office",
  "Bedroom",
  "Bathroom",
  "Gaming Room",
];

export type resolutionType = 
| "512 * 512"
| "768 * 768"
| "1024 * 1024"

export const resolutions: resolutionType[] = [
  "512 * 512",
  "768 * 768",
  "1024 * 1024"
]
