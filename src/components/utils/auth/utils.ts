export function parseExpiresIn(expiresIn: string): number {
  const num = parseInt(expiresIn);
  if (isNaN(num)) {
    throw new Error(`Invalid expiresIn format: ${expiresIn}`);
  }
  const unit = expiresIn.slice(-1);
  const multipliers: { [key: string]: number } = {
    's': 1000,
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000,
  };
  const multiplier = multipliers[unit] || 1000; 
  return num * multiplier;
}