
import { supabase } from '@/services/supabase';

export interface CheckoutData {
  packageId: string;
  packageTitle: string;
  packagePrice: number;
  creatorId: string;
  creatorName: string;
  userAlias: string;
  email?: string;
  whatsapp?: string;
}

export const createCheckoutSession = async (data: CheckoutData) => {
  try {
    const { data: response, error } = await supabase.functions.invoke('create-checkout', {
      body: data,
    });

    if (error) throw error;
    return response;
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

export const verifyPayment = async (session_id: string, transaction_id: string) => {
  try {
    const { data: response, error } = await supabase.functions.invoke('verify-payment', {
      body: { session_id, transaction_id },
    });

    if (error) throw error;
    return response;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw error;
  }
};
