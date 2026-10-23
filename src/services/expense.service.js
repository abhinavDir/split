import api from './api';

export const expenseService = {
  async getExpenses(groupId) {
    if (!groupId) return { success: true, data: { expenses: [] } };
    const response = await api.get(`/groups/${groupId}/expenses`);
    return response.data;
  },

  async createExpense(groupId, expenseData) {
    const response = await api.post(`/groups/${groupId}/expenses`, expenseData);
    return response.data;
  },

  async deleteExpense(expenseId) {
    const response = await api.delete(`/expenses/${expenseId}`);
    return response.data;
  },

  /**
   * Helper: Calculate split distribution accurately in paise
   */
  calculateSplit(totalPaise, splitType, participants, rawValues = {}) {
    if (!participants || participants.length === 0 || !totalPaise) return [];

    const count = participants.length;

    if (splitType === 'EQUAL') {
      const baseShare = Math.floor(totalPaise / count);
      let remainder = totalPaise % count;

      return participants.map((p) => {
        const extra = remainder > 0 ? 1 : 0;
        if (remainder > 0) remainder--;
        return {
          userId: p.userId,
          name: p.name,
          sharePaise: baseShare + extra,
        };
      });
    }

    if (splitType === 'EXACT') {
      return participants.map((p) => {
        const exactPaise = rawValues[p.userId] || 0;
        return {
          userId: p.userId,
          name: p.name,
          sharePaise: exactPaise,
        };
      });
    }

    if (splitType === 'PERCENTAGE') {
      let allocatedTotal = 0;
      const shares = participants.map((p, idx) => {
        const pct = rawValues[p.userId] || 0;
        if (idx === participants.length - 1) {
          const share = Math.max(0, totalPaise - allocatedTotal);
          return { userId: p.userId, name: p.name, sharePaise: share, percentage: pct };
        }
        const share = Math.round((totalPaise * pct) / 100);
        allocatedTotal += share;
        return { userId: p.userId, name: p.name, sharePaise: share, percentage: pct };
      });
      return shares;
    }

    return [];
  },
};
