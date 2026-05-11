import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import { toast } from 'sonner';

export const useOrders = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await axios.get('/orders');
      return data;
    }
  });

  const addOrder = useMutation({
    mutationFn: async (newOrder) => {
      const { data } = await axios.post('/orders', newOrder);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Order created successfully');
    },
    onError: () => toast.error('Failed to create order')
  });

  const updateOrderStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.put(`/orders/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Order status updated');
    },
    onError: () => toast.error('Failed to update order status')
  });

  const deleteOrder = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/orders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Order deleted');
    },
    onError: () => toast.error('Failed to delete order')
  });

  return { orders, isLoading, addOrder, updateOrderStatus, deleteOrder };
};
