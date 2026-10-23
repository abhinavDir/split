import api from './api';

export const groupService = {
  async getGroups() {
    const response = await api.get('/groups');
    return response.data;
  },

  async getGroupById(groupId) {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  async createGroup(groupData) {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  async inviteMember(groupId, memberData) {
    const response = await api.post(`/groups/${groupId}/invitations`, memberData);
    return response.data;
  },

  async joinGroup(groupId) {
    const response = await api.post(`/groups/${groupId}/join`);
    return response.data;
  },

  async getCollabInfo(groupId) {
    const response = await api.get(`/groups/${groupId}/collab-info`);
    return response.data;
  },

  async rejectInvite(groupId) {
    const response = await api.post(`/groups/${groupId}/reject-invite`);
    return response.data;
  },

  async broadcastBill(groupId) {
    const response = await api.post(`/groups/${groupId}/broadcast-bill`);
    return response.data;
  },

  async completeTrip(groupId) {
    const response = await api.post(`/groups/${groupId}/complete-trip`);
    return response.data;
  },

  async reopenTrip(groupId) {
    const response = await api.post(`/groups/${groupId}/reopen-trip`);
    return response.data;
  },

  async removeMember(groupId, userId) {
    const response = await api.delete(`/groups/${groupId}/members/${userId}`);
    return response.data;
  },
};
