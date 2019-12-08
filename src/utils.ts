export function numberWithCommas(x: number, decimals?: number): string {
  if (!decimals) {
    decimals = 0;
  }
  return x.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function getRandomFloat(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
