import api from './api';

export const settlementService = {
  async getGroupBalances(groupId) {
    if (!groupId) return { success: true, data: { memberBalances: [], suggestedTransfers: [], totalGroupSpendPaise: 0 } };
    const response = await api.get(`/groups/${groupId}/balances`);
    return response.data;
  },

  async finalizeSettlement(groupId, note = '') {
    const response = await api.post(`/groups/${groupId}/settlements/finalize`, { note });
    return response.data;
  },

  async getSettlementHistory(groupId) {
    if (!groupId) return { success: true, data: { settlements: [] } };
    const response = await api.get(`/groups/${groupId}/settlements`);
    return response.data;
  },

  async getPaymentIntent(settlementId, transferId) {
    const response = await api.post(`/settlements/${settlementId}/payment-intent`, {
      transferId,
    });
    return response.data;
  },

  async reportPayment(settlementId, transferId, details = {}) {
    const response = await api.post(`/settlements/${settlementId}/report-payment`, {
      transferId,
      ...details,
    });
    return response.data;
  },

  async confirmReceived(settlementId, transferId, details = {}) {
    const response = await api.post(`/settlements/${settlementId}/confirm-received`, {
      transferId,
      ...details,
    });
    return response.data;
  },

  async disputePayment(settlementId, transferId, details = {}) {
    const response = await api.post(`/settlements/${settlementId}/dispute-payment`, {
      transferId,
      ...details,
    });
    return response.data;
  },

  async recordPayment(settlementId, transferId, paymentDetails) {
    const response = await api.post(`/settlements/${settlementId}/payments`, {
      transferId,
      ...paymentDetails,
    });
    return response.data;
  },
};
