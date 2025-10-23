// pages/api/warehouses/index.js
import fs from 'fs';
import path from 'path';
import { NextApiRequest, NextApiResponse } from 'next';
import { Warehouse } from '@/types';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const filePath = path.join(process.cwd(), 'data', 'warehouses.json');
  const jsonData = fs.readFileSync(filePath, 'utf8');
  let warehouses: Warehouse[] = JSON.parse(jsonData);

  if (req.method === 'GET') {
    res.status(200).json(warehouses);
  } else if (req.method === 'POST') {
    const newWarehouse: Warehouse = req.body;
    newWarehouse.id = warehouses.length ? Math.max(...warehouses.map(w => w.id)) + 1 : 1;
    warehouses.push(newWarehouse);
    fs.writeFileSync(filePath, JSON.stringify(warehouses, null, 2));
    res.status(201).json(newWarehouse);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

