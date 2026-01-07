
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') 
    .replace(/\s+/g, '-') 
    .replace(/-+/g, '-'); 
}


export function generateUniqueId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // First 2 characters: letters
  for (let i = 0; i < 2; i++) {
    result += chars.charAt(Math.floor(Math.random() * 26));
  }
  
  // Next 8 characters: numbers
  for (let i = 0; i < 8; i++) {
    result += Math.floor(Math.random() * 10);
  }
  
  return result;
}


export function generateFullSlug(title: string): string {
  const slug = generateSlug(title);
  const uniqueId = generateUniqueId();
  return `${slug}-${uniqueId}`;
}


export function extractUniqueId(fullSlug: string): string {
  const parts = fullSlug.split('-');
  return parts[parts.length - 1];
}


export function isValidSlug(slug: string): boolean {
  // Check if slug ends with pattern like ET00357289 (2 letters + 8 digits)
  const pattern = /-[A-Z]{2}\d{8}$/;
  return pattern.test(slug);
}