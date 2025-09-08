import { apiClient } from '@/services/common/api'
import { PATHS } from '@/services/common/paths'
import type { ApiResponse } from '@/services/common/types'
import type { 
  PaymentInitializeRequest, 
  PaymentInitializeResponse,
  PaymentVerificationResponse 
} from './types'

export const paymentsApi = {
  // Initialize payment with Paystack
  initializePayment: async (data: PaymentInitializeRequest): Promise<PaymentInitializeResponse['data']> => {
    const response = await apiClient.post<ApiResponse<PaymentInitializeResponse['data']>>(
      PATHS.payments.initialize,
      data
    )
    return response.data.data
  },

  // Verify payment status
  verifyPayment: async (reference: string): Promise<PaymentVerificationResponse['data']> => {
    const response = await apiClient.get<ApiResponse<PaymentVerificationResponse['data']>>(
      PATHS.payments.verify(reference)
    )
    return response.data.data
  },
}
