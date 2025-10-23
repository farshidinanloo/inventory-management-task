import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import { Transfer } from '@/types';

const dataFilePath = path.join(process.cwd(), 'data', 'transfers.json');
const stockFilePath = path.join(process.cwd(), 'data', 'stock.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const transfers: Transfer[] = JSON.parse(data);
      res.status(200).json(transfers);
    } catch (error) {
      res.status(500).json({ error: 'Failed to read transfers data' });
    }
  } else if (req.method === 'POST') {
    try {
      const { productId, fromWarehouseId, toWarehouseId, quantity, requestedBy, notes } = req.body;

      // Validation
      if (!productId || !fromWarehouseId || !toWarehouseId || !quantity || !requestedBy) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (fromWarehouseId === toWarehouseId) {
        return res.status(400).json({ error: 'Cannot transfer to the same warehouse' });
      }

      if (quantity <= 0) {
        return res.status(400).json({ error: 'Quantity must be greater than 0' });
      }

      // Check if source warehouse has enough stock
      const stockData = fs.readFileSync(stockFilePath, 'utf8');
      const stock: any[] = JSON.parse(stockData);
      
      const sourceStock = stock.find(s => s.productId === productId && s.warehouseId === fromWarehouseId);
      if (!sourceStock || sourceStock.quantity < quantity) {
        return res.status(400).json({ error: 'Insufficient stock in source warehouse' });
      }

      // Read existing transfers
      const data = fs.readFileSync(dataFilePath, 'utf8');
      const transfers: Transfer[] = JSON.parse(data);

      // Create new transfer
      const newTransfer: Transfer = {
        id: transfers.length > 0 ? Math.max(...transfers.map(t => t.id)) + 1 : 1,
        productId,
        fromWarehouseId,
        toWarehouseId,
        quantity,
        status: 'pending',
        requestedBy,
        requestedAt: new Date().toISOString(),
        notes
      };

      // Update stock levels
      const updatedStock = stock.map(s => {
        if (s.productId === productId && s.warehouseId === fromWarehouseId) {
          return { ...s, quantity: s.quantity - quantity };
        }
        return s;
      });

      // Add stock to destination warehouse or create new entry
      const destStock = updatedStock.find(s => s.productId === productId && s.warehouseId === toWarehouseId);
      if (destStock) {
        destStock.quantity += quantity;
      } else {
        const newStockEntry = {
          id: Math.max(...updatedStock.map(s => s.id)) + 1,
          productId,
          warehouseId: toWarehouseId,
          quantity
        };
        updatedStock.push(newStockEntry);
      }

      // Save updated stock
      fs.writeFileSync(stockFilePath, JSON.stringify(updatedStock, null, 2));

      // Add transfer and save
      transfers.push(newTransfer);
      fs.writeFileSync(dataFilePath, JSON.stringify(transfers, null, 2));

      res.status(201).json(newTransfer);
    } catch (error) {
      console.error('Error creating transfer:', error);
      res.status(500).json({ error: 'Failed to create transfer' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
