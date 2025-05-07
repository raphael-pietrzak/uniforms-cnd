import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import OrdersTable from '../../components/admin/OrdersTable';
import { Order } from '../../types';
import { Search, Filter } from 'lucide-react';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';

const OrdersPage: React.FC = () => {
  const { orders } = useShop();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const filteredOrders = orders.filter((order) => {
    // Filter by search term
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // This would be handled by the context in a real app
    console.log(`Update order ${orderId} to status: ${newStatus}`);
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Commandes</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="w-full md:w-80">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={18} className="text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Rechercher des commandes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  fullWidth
                />
              </div>
            </div>
            
            <div className="w-full md:w-48">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: 'all', label: 'Tous les Statuts' },
                  { value: 'pending', label: 'En Attente' },
                  { value: 'paid', label: 'Payée' },
                  { value: 'ready', label: 'Prête pour Retrait' },
                  { value: 'collected', label: 'Récupérée' },
                ]}
                fullWidth
              />
            </div>
          </div>
        </div>
        
        <OrdersTable orders={filteredOrders} onUpdateStatus={handleUpdateStatus} />
      </div>
    </div>
  );
};

export default OrdersPage;