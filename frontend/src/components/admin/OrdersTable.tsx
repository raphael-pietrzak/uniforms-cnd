import React from 'react';
import { Order } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onUpdateStatus }) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'paid':
        return <Badge variant="primary">Paid</Badge>;
      case 'ready':
        return <Badge variant="success">Ready for Pickup</Badge>;
      case 'collected':
        return <Badge variant="default">Collected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (orders.length === 0) {
    return <p className="text-gray-500 py-4">No orders found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Items
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Payment
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.id.substring(0, 8)}...
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customerName}
                <div className="text-xs text-gray-400">{order.customerEmail}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.items.length} items
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                €{order.total.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.paymentMethod === 'online' ? 'Online (Card)' : 'In-person'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {getStatusBadge(order.status)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {order.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => onUpdateStatus(order.id, 'paid')}
                  >
                    Mark Paid
                  </Button>
                )}
                {order.status === 'paid' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onUpdateStatus(order.id, 'ready')}
                  >
                    Ready for Pickup
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, 'collected')}
                  >
                    Mark Collected
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;