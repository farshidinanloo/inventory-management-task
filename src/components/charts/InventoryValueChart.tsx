import dynamic from 'next/dynamic';
import {
  Card,
  CardContent,
  Typography,
} from '@mui/material';

// Dynamic imports for charts to avoid SSR issues
const BarChart = dynamic(() => import('recharts').then(mod => mod.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(mod => mod.Bar), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(mod => mod.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(mod => mod.YAxis), { ssr: false });
const CartesianGrid = dynamic(() => import('recharts').then(mod => mod.CartesianGrid), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(mod => mod.Tooltip), { ssr: false });
const ResponsiveContainer = dynamic(() => import('recharts').then(mod => mod.ResponsiveContainer), { ssr: false });

interface InventoryValueChartProps {
  data: Array<{ name: string; value: number; quantity: number }>;
}

export default function InventoryValueChart({ data }: InventoryValueChartProps) {
  return (
    <Card sx={{ height: 400 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom sx={{ color: '#2E7D32', fontWeight: 'bold' }}>
          Top Products by Inventory Value
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name"  />
            <YAxis />
            <Tooltip formatter={(value: any) => [`$${value.toLocaleString()}`, 'Value']} />
            <Bar dataKey="value" fill="#66BB6A" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
