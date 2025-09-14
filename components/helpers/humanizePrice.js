import config from './config';
export function humanizePrice(cent, currency = config.currency) {
  return `${currency}${(cent / 100).toFixed(2)}`;
}

export function toCent(price) {
  return Math.round(parseFloat(price) * 100);
}

export function toBaseUnit(price) {
  return price / 100.00;
}
