import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useQueryClient } from '@tanstack/react-query';

const socket = io('http://localhost:3001');

export const useSocket = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleInventoryUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    };

    const handleOrderUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    };

    const handleManufacturingUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturingJobs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    };

    socket.on('inventory_updated', handleInventoryUpdate);
    socket.on('order_updated', handleOrderUpdate);
    socket.on('manufacturing_updated', handleManufacturingUpdate);

    return () => {
      socket.off('inventory_updated', handleInventoryUpdate);
      socket.off('order_updated', handleOrderUpdate);
      socket.off('manufacturing_updated', handleManufacturingUpdate);
    };
  }, [queryClient]);

  return socket;
};
