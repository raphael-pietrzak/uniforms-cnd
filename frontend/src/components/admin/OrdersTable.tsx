import React from 'react';
import { Order } from '../../types';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

// Helper function to format order IDs safely
const formatOrderId = (id: any): string => {
  const stringId = String(id || '');
  return stringId.length > 8 ? `${stringId.substring(0, 8)}...` : stringId;
};

interface OrdersTableProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: Order['status']) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ orders, onUpdateStatus }) => {
  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">En attente</Badge>;
      case 'paid':
        return <Badge variant="primary">Payé</Badge>;
      case 'ready':
        return <Badge variant="success">Prêt à récupérer</Badge>;
      case 'collected':
        return <Badge variant="default">Récupéré</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (orders.length === 0) {
    return <p className="text-gray-500 py-4 ml-4">Aucune commande trouvée.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              N° Commande
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Articles
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Paiement
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
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
                {formatOrderId(order.id)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDate(order.created_at)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.customer_name}
                <div className="text-xs text-gray-400">{order.customer_email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.items.length} articles
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.total.toFixed(2)} €
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {order.payment_method === 'online' ? 'En ligne (Carte)' : 'En personne'}
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
                    Marquer payé
                  </Button>
                )}
                {order.status === 'paid' && (
                  <Button
                    size="sm"
                    variant="success"
                    onClick={() => onUpdateStatus(order.id, 'ready')}
                  >
                    Prêt à récupérer
                  </Button>
                )}
                {order.status === 'ready' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateStatus(order.id, 'collected')}
                  >
                    Marquer récupéré
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