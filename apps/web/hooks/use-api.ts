import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contactsApi, companiesApi, dealsApi, pipelinesApi, activitiesApi, reportsApi } from '../lib/api';
import type { ContactFilter, CompanyFilter, DealFilter, CreateDeal, CreateContact, CreateCompany, ActivityFilter } from '@antigravity/shared';

// ─── Contacts ───
export function useContacts(params?: ContactFilter) {
  return useQuery({
    queryKey: ['contacts', params],
    queryFn: () => contactsApi.list(params as any),
  });
}

export function useContact(id: string) {
  return useQuery({
    queryKey: ['contact', id],
    queryFn: () => contactsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateContact() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateContact) => contactsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
}

// ─── Companies ───
export function useCompanies(params?: CompanyFilter) {
  return useQuery({
    queryKey: ['companies', params],
    queryFn: () => companiesApi.list(params as any),
  });
}

// ─── Deals ───
export function useDeals(params?: DealFilter) {
  return useQuery({
    queryKey: ['deals', params],
    queryFn: () => dealsApi.list(params as any),
  });
}

// ─── Pipelines ───
export function usePipelines() {
  return useQuery({
    queryKey: ['pipelines'],
    queryFn: () => pipelinesApi.list(),
  });
}

// ─── Activities ───
export function useActivities(params?: ActivityFilter) {
  return useQuery({
    queryKey: ['activities', params],
    queryFn: () => activitiesApi.list(params as any),
  });
}

// ─── Reports ───
export function usePipelineReport(pipelineId?: string) {
  return useQuery({
    queryKey: ['reports', 'pipeline', pipelineId],
    queryFn: () => reportsApi.pipeline(pipelineId),
  });
}

export function useRevenueReport() {
  return useQuery({
    queryKey: ['reports', 'revenue'],
    queryFn: () => reportsApi.revenue(),
  });
}

export function useLeaderboardReport() {
  return useQuery({
    queryKey: ['reports', 'leaderboard'],
    queryFn: () => reportsApi.leaderboard(),
  });
}

export function useActivityReport() {
  return useQuery({
    queryKey: ['reports', 'activities'],
    queryFn: () => reportsApi.activities(),
  });
}
