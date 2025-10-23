// pages/api/stock/index.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Stock } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'stock.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  let stock: Stock[] = JSON.parse(jsonData);

  if (req.method === 'GET') {
    res.status(200).json(stock);
  } else if (req.method === 'POST') {
    const newStock: Stock = req.body;
    newStock.id = stock.length ? Math.max(...stock.map(s => s.id)) + 1 : 1;
    stock.push(newStock);
    fs.writeFileSync(filePath, JSON.stringify(stock, null, 2));
    res.status(201).json(newStock);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

