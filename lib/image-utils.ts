/**
 * Generates a shimmer effect data URL for image placeholders
 * This provides a smooth loading experience while images are being fetched
 */
export function getShimmerDataURL(width: number, height: number): string {
  const shimmer = `
    <svg width="${width}" height="${height}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="0%" />
          <stop stop-color="#edeef1" offset="20%" />
          <stop stop-color="#f6f7f8" offset="40%" />
          <stop stop-color="#f6f7f8" offset="100%" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="#f6f7f8" />
      <rect id="r" width="${width}" height="${height}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${width}" to="${width}" dur="1s" repeatCount="indefinite"  />
    </svg>
  `;

  const base64 = Buffer.from(shimmer).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}
