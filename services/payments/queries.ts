import { useMutation, useQuery } from '@tanstack/react-query'
import { paymentsApi } from './api'
import type { PaymentInitializeRequest } from './types'

// Query keys for payment operations
export const paymentKeys = {
  all: ['payments'] as const,
  verify: (reference: string) => [...paymentKeys.all, 'verify', reference] as const,
}

// Initialize payment mutation
export const useInitializePayment = () => {
  return useMutation({
    mutationFn: (data: PaymentInitializeRequest) => paymentsApi.initializePayment(data),
    onSuccess: (data) => {
      // Redirect to Paystack payment page
      window.location.href = data.authorization_url
    },
    onError: (error) => {
      console.error('Payment initialization failed:', error)
    },
  })
}

// Verify payment query
export const useVerifyPayment = (reference: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: paymentKeys.verify(reference),
    queryFn: () => paymentsApi.verifyPayment(reference),
    enabled: !!reference && enabled,
    retry: 3,
    retryDelay: 1000,
  })
}
