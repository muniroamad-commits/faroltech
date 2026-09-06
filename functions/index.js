const { onCall, onRequest, HttpsError } = require('firebase-functions/v2/https')
const { initializeApp } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')

initializeApp()
const db = getFirestore()

// Configure com: firebase functions:secrets:set PAYSUITE_SECRET_KEY
const PAYSUITE_SECRET_KEY = process.env.PAYSUITE_SECRET_KEY
const PAYSUITE_API_URL = 'https://paysuite.co.mz/api/v1'

exports.createPaysuitePayment = onCall(async (request) => {
  const uid = request.auth?.uid
  if (!uid) throw new HttpsError('unauthenticated', 'É necessário iniciar sessão.')

  const { invoiceId, method } = request.data
  const invoiceRef = db.collection('invoices').doc(invoiceId)
  const invoiceSnap = await invoiceRef.get()

  if (!invoiceSnap.exists) throw new HttpsError('not-found', 'Factura não encontrada.')
  const invoice = invoiceSnap.data()
  if (invoice.clientId !== uid) throw new HttpsError('permission-denied', 'Esta factura não lhe pertence.')
  if (invoice.status === 'paid') throw new HttpsError('failed-precondition', 'Esta factura já foi paga.')

  const response = await fetch(`${PAYSUITE_API_URL}/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${PAYSUITE_SECRET_KEY}` },
    body: JSON.stringify({
      amount: invoice.amount, method, reference: invoiceId, description: invoice.description,
      callback_url: `${process.env.FUNCTIONS_BASE_URL}/paysuiteWebhook`,
    }),
  })

  if (!response.ok) throw new HttpsError('internal', 'Não foi possível iniciar o pagamento na PaySuite.')
  const data = await response.json()
  await invoiceRef.update({ paymentIntentId: data.id || null, paymentMethod: method })
  return data.checkoutUrl ? { checkoutUrl: data.checkoutUrl } : { status: 'pending_ussd' }
})

// Configure este URL como "callback_url" no painel da PaySuite.
exports.paysuiteWebhook = onRequest(async (req, res) => {
  // TODO: validar a assinatura do webhook conforme a documentação da PaySuite
  // antes de confiar no conteúdo do pedido.
  const { reference, status } = req.body
  if (status === 'success' && reference) {
    await db.collection('invoices').doc(reference).update({ status: 'paid', paidAt: new Date() })
  }
  res.status(200).send('ok')
})
