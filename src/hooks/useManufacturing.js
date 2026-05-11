import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxios from './useAxios';
import { toast } from 'sonner';

export const useManufacturing = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  const { data: manufacturingJobs = [], isLoading } = useQuery({
    queryKey: ['manufacturingJobs'],
    queryFn: async () => {
      const { data } = await axios.get('/manufacturing');
      return data;
    }
  });

  const startJob = useMutation({
    mutationFn: async (jobData) => {
      const { data } = await axios.post('/manufacturing', jobData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturingJobs'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Manufacturing job started successfully');
    },
    onError: () => toast.error('Failed to start manufacturing job')
  });

  const updateJobStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data } = await axios.put(`/manufacturing/${id}/status`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['manufacturingJobs'] });
      toast.success('Job status updated');
    },
    onError: () => toast.error('Failed to update job status')
  });

  return { manufacturingJobs, isLoading, startJob, updateJobStatus };
};
