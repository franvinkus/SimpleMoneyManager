// app/utils/receiptParser.ts
import { ItemDetail } from '../navigation/types';

export interface ParsedReceiptData {
  storeName: string | null;
  date: string | null;
  total: string | null;
  items: ItemDetail[];
}

export const parseReceiptText = (rawText: string): ParsedReceiptData => {
  const lines = rawText.split('\n');
  const items: ItemDetail[] = [];
  
  let storeName: string | null = lines.length > 1 ? lines[0].trim() : 'Toko tidak terdeteksi';
  let date: string | null = null;
  let total: string | null = null;
  
  let lastItemName: string | null = null;
  let isItemSection = true; 

  const itemAndPriceRegex = /^\d+\s+(.+)\s+([\d.,]+)$/;
  const itemNameOnlyRegex = /^\d+\s+(.+)$/;
  const priceOnlyRegex = /^([\d.,]+)$/;
  const dateRegex = /(\d{1,2}\s\w+\s\d{2})\s\d{2}:\d{2}:\d{2}/;
  const totalRegex = /Total\s*:?\s*([\d,.]+)/i;
  const subtotalRegex = /Subtotal/i;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    const dateMatch = trimmedLine.match(dateRegex);
    if (dateMatch && !date) {
      date = dateMatch[1];
      continue;
    }

    if (subtotalRegex.test(trimmedLine) || totalRegex.test(trimmedLine)) {
        isItemSection = false;
        
        const totalMatch = trimmedLine.match(totalRegex);
        if (totalMatch) {
            total = totalMatch[0].replace(/[.,]/g, '');
        }
        continue;
    }
    if (isItemSection) {
        const itemAndPriceMatch = trimmedLine.match(itemAndPriceRegex);
        if (itemAndPriceMatch) {
            const name = itemAndPriceMatch[1].trim();
            const price = parseFloat(itemAndPriceMatch[2].replace(/[.,]/g, ''));
            if (!isNaN(price)) {
                items.push({ name, quantity: 1, totalItemPrice: price, rawLine: trimmedLine });
            }
            lastItemName = null;
            continue;
        }
        
        const priceOnlyMatch = trimmedLine.match(priceOnlyRegex);
        if (priceOnlyMatch && lastItemName) {
            const price = parseFloat(priceOnlyMatch[1].replace(/[.,]/g, ''));
            if (!isNaN(price)) {
                items.push({ name: lastItemName, quantity: 1, totalItemPrice: price, rawLine: `${lastItemName} - ${price}` });
            }
            lastItemName = null;
            continue;
        }
        
        const itemNameOnlyMatch = trimmedLine.match(itemNameOnlyRegex);
        if (itemNameOnlyMatch) {
            lastItemName = itemNameOnlyMatch[1].trim();
            continue;
        }
    }
  }

  return { storeName, date, total, items };
};