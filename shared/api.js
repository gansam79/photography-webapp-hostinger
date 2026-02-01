/**
 * Shared code between client and server
 * Useful to share pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export const DemoResponse = {
  message: "Hello from Express server",
};

// Predefined services for photography business
export const PREDEFINED_SERVICES = [
  { id: 1, name: "Traditional Photography", category: "photography" },
  { id: 2, name: "Candid Photography", category: "photography" },
  { id: 3, name: "Cinematic Wedding Film", category: "video" },
  { id: 4, name: "Traditional Video", category: "video" },
  { id: 5, name: "Drone Shoot", category: "drone" },
  { id: 6, name: "Wedding Albums", category: "product" },
  { id: 7, name: "Frames", category: "product" },
];

export const EVENT_TYPES = ["Wedding", "Pre-wedding", "Other"];
export const CLIENT_CATEGORIES = ["Regular", "VIP", "New Inquiry"];
export const PAYMENT_STATUS = ["Paid", "Partially Paid", "Unpaid"];
