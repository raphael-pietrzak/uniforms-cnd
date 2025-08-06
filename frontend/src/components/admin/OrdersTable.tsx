import React from 'react';
import { Edit, Trash2 } from 'lucide-react';
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
  onDeleteOrder: (orderId: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  onUpdateStatus,
  onDeleteOrder
}) => {
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

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
              Client
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Montant
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Statut
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                Aucune commande trouvée
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {formatOrderId(order.id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>
                    <div className="font-medium">{order.customer_name}</div>
                    <div className="text-xs text-gray-400">{order.customer_email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.created_at)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {Number(order.total).toFixed(2)}&nbsp;€
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <select
                      className="form-select rounded-md border-gray-300 text-sm"
                      value={order.status}
                      onChange={(e) => onUpdateStatus(order.id, e.target.value as Order['status'])}
                    >
                      <option value="pending">En attente</option>
                      <option value="paid">Payée</option>
                      <option value="ready">Prête</option>
                      <option value="collected">Récupérée</option>
                      <option value="cancelled">Annulée</option>
                    </select>
                    <span
                      className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        order.status === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : order.status === 'ready'
                          ? 'bg-blue-100 text-blue-800'
                          : order.status === 'collected'
                          ? 'bg-purple-100 text-purple-800'
                          : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {order.status === 'paid' ? 'Payée' : 
                       order.status === 'pending' ? 'En Attente' : 
                       order.status === 'ready' ? 'Prête' : 
                       order.status === 'collected' ? 'Récupérée' : 
                       order.status === 'cancelled' ? 'Annulée' : 
                       order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onUpdateStatus(order.id, 'paid')}
                    >
                      Marquer payé
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => onUpdateStatus(order.id, 'ready')}
                    >
                      Prêt à récupérer
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUpdateStatus(order.id, 'collected')}
                    >
                      Marquer récupéré
                    </Button>
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => onDeleteOrder(order.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;