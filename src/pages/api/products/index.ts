// pages/api/products/index.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'products.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  let products: Product[] = JSON.parse(jsonData);

  if (req.method === 'GET') {
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const newProduct: Product = req.body;
    newProduct.id = products.length ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push(newProduct);
    fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

