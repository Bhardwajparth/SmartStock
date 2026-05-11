import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import { toast } from 'sonner';

export const useInventory = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ['inventory'],
    queryFn: async () => {
      const { data } = await axios.get('/inventory');
      return data;
    }
  });

  const addProduct = useMutation({
    mutationFn: async (newProduct) => {
      const { data } = await axios.post('/inventory', newProduct);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Product added successfully');
    },
    onError: () => toast.error('Failed to add product')
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...updatedData }) => {
      const { data } = await axios.put(`/inventory/${id}`, updatedData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Product updated successfully');
    },
    onError: () => toast.error('Failed to update product')
  });

  const deleteProduct = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/inventory/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Product deleted successfully');
    },
    onError: () => toast.error('Failed to delete product')
  });

  return { inventory, isLoading, addProduct, updateProduct, deleteProduct };
};
