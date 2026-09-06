import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

// A chave secreta da PaySuite fica sempre no backend (Cloud Function), nunca aqui.
export async function payInvoice(invoiceId, method) {
  const createPayment = httpsCallable(functions, 'createPaysuitePayment')
  const result = await createPayment({ invoiceId, method })
  return result.data
}
