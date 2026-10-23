import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { groupService } from '../services/group.service';
import { expenseService } from '../services/expense.service';
import { settlementService } from '../services/settlement.service';
import { useAuth } from './AuthContext';

const ExpenseGroupContext = createContext(null);

export function ExpenseGroupProvider({ children }) {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [activeGroupId, setActiveGroupId] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [balances, setBalances] = useState(null);
  const [allBalances, setAllBalances] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch all groups for the authenticated user and compute all-group balances
  const fetchGroups = useCallback(async () => {
    if (!user) {
      setGroups([]);
      setActiveGroupId(null);
      setExpenses([]);
      setBalances(null);
      setAllBalances({});
      setLoading(false);
      return;
    }

    try {
      const res = await groupService.getGroups();
      const userGroups = res?.data?.groups || [];
      setGroups(userGroups);

      // Default activeGroupId if not set or if current activeGroupId is no longer in groups
      if (userGroups.length > 0) {
        setActiveGroupId(prev => {
          if (prev && userGroups.some(g => g._id === prev)) {
            return prev;
          }
          return userGroups[0]._id;
        });
      } else {
        setActiveGroupId(null);
      }

      // Fetch balances for all user groups in parallel to compute overall totals
      const balancePromises = userGroups.map(async (g) => {
        try {
          const bRes = await settlementService.getGroupBalances(g._id);
          return { groupId: g._id, data: bRes?.data };
        } catch {
          return { groupId: g._id, data: null };
        }
      });

      const balanceResults = await Promise.all(balancePromises);
      const balanceMap = {};
      balanceResults.forEach(r => {
        if (r.data) balanceMap[r.groupId] = r.data;
      });
      setAllBalances(balanceMap);
    } catch (err) {
      console.error('Failed to fetch groups:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch expenses and balances for a specific group
  const fetchGroupData = useCallback(async (groupId) => {
    if (!groupId || !user) return;
    try {
      const [expRes, balRes] = await Promise.all([
        expenseService.getExpenses(groupId),
        settlementService.getGroupBalances(groupId),
      ]);

      if (expRes?.data?.expenses) {
        setExpenses(expRes.data.expenses);
      }
      if (balRes?.data) {
        setBalances(balRes.data);
        setAllBalances(prev => ({ ...prev, [groupId]: balRes.data }));
      }
    } catch (err) {
      console.error('Error fetching group data:', err);
    }
  }, [user]);

  // Initial fetch on user change
  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  // Fetch group data when active group changes
  useEffect(() => {
    if (activeGroupId) {
      fetchGroupData(activeGroupId);
    } else {
      setExpenses([]);
      setBalances(null);
    }
  }, [activeGroupId, fetchGroupData]);

  // Listen to custom expense lifecycle events
  useEffect(() => {
    const handleExpenseCreated = (e) => {
      const newExp = e.detail;
      if (newExp) {
        setExpenses(prev => [newExp, ...prev.filter(item => item._id !== newExp._id)]);
      }
      if (activeGroupId) {
        fetchGroupData(activeGroupId);
      }
      fetchGroups();
    };

    const handleExpenseDeleted = ({ detail }) => {
      const expenseId = detail?.expenseId;
      if (expenseId) {
        setExpenses(prev => prev.filter(e => e._id !== expenseId));
      }
      if (activeGroupId) {
        fetchGroupData(activeGroupId);
      }
      fetchGroups();
    };

    const handleGroupDataChanged = () => {
      if (activeGroupId) {
        fetchGroupData(activeGroupId);
      }
      fetchGroups();
    };

    window.addEventListener('expense:created', handleExpenseCreated);
    window.addEventListener('expense:deleted', handleExpenseDeleted);
    window.addEventListener('group:data-changed', handleGroupDataChanged);
    window.addEventListener('group:finalized', handleGroupDataChanged);

    return () => {
      window.removeEventListener('expense:created', handleExpenseCreated);
      window.removeEventListener('expense:deleted', handleExpenseDeleted);
      window.removeEventListener('group:data-changed', handleGroupDataChanged);
      window.removeEventListener('group:finalized', handleGroupDataChanged);
    };
  }, [activeGroupId, fetchGroupData, fetchGroups]);

  const activeGroup = groups.find(g => g._id === activeGroupId) || (groups.length > 0 ? groups[0] : null);

  // Compute aggregate totals across ALL groups the user belongs to
  let aggregateOwedToYouPaise = 0;
  let aggregateYouOwePaise = 0;

  if (user && Object.keys(allBalances).length > 0) {
    const currentUserId = (user._id || user.id)?.toString();
    Object.values(allBalances).forEach(groupBal => {
      if (groupBal?.memberBalances) {
        const myBal = groupBal.memberBalances.find(m => m.userId?.toString() === currentUserId);
        if (myBal) {
          if (myBal.netBalancePaise > 0) {
            aggregateOwedToYouPaise += myBal.netBalancePaise;
          } else if (myBal.netBalancePaise < 0) {
            aggregateYouOwePaise += Math.abs(myBal.netBalancePaise);
          }
        }
      }
    });
  }

  return (
    <ExpenseGroupContext.Provider
      value={{
        groups,
        activeGroupId,
        setActiveGroupId,
        activeGroup,
        expenses,
        balances,
        allBalances,
        aggregateOwedToYouPaise,
        aggregateYouOwePaise,
        loading,
        refreshGroups: fetchGroups,
        refreshActiveGroup: () => fetchGroupData(activeGroupId),
        fetchGroupData,
      }}
    >
      {children}
    </ExpenseGroupContext.Provider>
  );
}

export const useExpenseGroup = () => {
  return useContext(ExpenseGroupContext) || {
    groups: [],
    activeGroupId: null,
    setActiveGroupId: () => {},
    activeGroup: null,
    expenses: [],
    balances: null,
    allBalances: {},
    aggregateOwedToYouPaise: 0,
    aggregateYouOwePaise: 0,
    loading: false,
    refreshGroups: () => {},
    refreshActiveGroup: () => {},
    fetchGroupData: () => {},
  };
};
