import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { BarChart3, Download, Filter, ChevronDown, Eye, X, Lock } from 'lucide-react';
import { Lead, Bot } from '../types';
import { createLeadUnlockOrder } from '../lib/razorpay';
import { Link } from 'react-router-dom';

export const Leads = () => {
  const { user, userData } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [bots, setBots] = useState<Record<string, Bot>>({});
  const [loading, setLoading] = useState(true);
  const [selectedBotId, setSelectedBotId] = useState<string>('all');
  const [showBotFilter, setShowBotFilter] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [unlockingLead, setUnlockingLead] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      const leadsQuery = query(
        collection(db, 'leads'),
        where('ownerId', '==', user.uid)
      );
      const leadsSnapshot = await getDocs(leadsQuery);
      const leadsData = leadsSnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
          collectedAt: doc.data().collectedAt?.toDate()
        }))
        .sort((a, b) => (b.collectedAt?.getTime() || 0) - (a.collectedAt?.getTime() || 0)) as Lead[];
      setLeads(leadsData);

      const uniqueBotIds = [...new Set(leadsData.map(lead => lead.botId))];
      const botsData: Record<string, Bot> = {};

      for (const botId of uniqueBotIds) {
        const botDoc = await getDoc(doc(db, 'bots', botId));
        if (botDoc.exists()) {
          botsData[botId] = {
            id: botDoc.id,
            ...botDoc.data(),
            createdAt: botDoc.data().createdAt?.toDate()
          } as Bot;
        }
      }
      setBots(botsData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLeads = selectedBotId === 'all'
    ? leads
    : leads.filter(lead => lead.botId === selectedBotId);

  const getColumnsForBot = (botId: string) => {
    const bot = bots[botId];
    if (!bot) return [];
    return bot.config.questions.map(q => {
      const columnHeader = q.columnHeader || q.text;
      return {
        header: columnHeader,
        key: columnHeader
      };
    });
  };

  const getAllColumns = () => {
    if (selectedBotId !== 'all' && bots[selectedBotId]) {
      return getColumnsForBot(selectedBotId);
    }

    const allQuestions = new Set<string>();
    filteredLeads.forEach(lead => {
      Object.keys(lead.answers).forEach(question => allQuestions.add(question));
    });
    return Array.from(allQuestions).map(q => ({ header: q, key: q }));
  };

  const columns = getAllColumns();

  const exportToCSV = () => {
    if (filteredLeads.length === 0) return;

    const csvColumns = getAllColumns();
    const headers = ['Date', 'Time', 'Page URL', 'Bot', ...csvColumns.map(c => c.header)];
    const rows = filteredLeads.map(lead => [
      lead.collectedAt?.toLocaleDateString() || '',
      lead.collectedAt?.toLocaleTimeString() || '',
      lead.pageUrl,
      bots[lead.botId]?.config?.leadsTableName || bots[lead.botId]?.name || 'Unknown',
      ...csvColumns.map(col => lead.answers[col.key] || '')
    ]);

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const botName = selectedBotId !== 'all' && bots[selectedBotId]
      ? (bots[selectedBotId].config?.leadsTableName || bots[selectedBotId].name)
      : 'all-leads';
    a.download = `${botName}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getTableName = () => {
    if (selectedBotId === 'all') return 'All Leads';
    const bot = bots[selectedBotId];
    return bot?.config?.leadsTableName || bot?.name || 'Leads';
  };

  const getLeadName = (lead: Lead) => {
    const nameFields = ['name', 'Name', 'Full Name', 'full name', 'Your Name', 'your name'];
    for (const field of nameFields) {
      if (lead.answers[field]) return lead.answers[field];
    }
    return 'Anonymous';
  };

  const getLeadEmail = (lead: Lead) => {
    const emailFields = ['email', 'Email', 'Email Address', 'email address', 'Your Email', 'your email'];
    for (const field of emailFields) {
      if (lead.answers[field]) return lead.answers[field];
    }
    return '-';
  };

  const handleUnlockLead = async (leadId: string) => {
    if (!user) return;

    setUnlockingLead(leadId);
    try {
      await createLeadUnlockOrder(user.uid, leadId);
      await fetchData();
    } catch (error) {
      console.error('Failed to unlock lead:', error);
      alert('Failed to unlock lead. Please try again.');
    } finally {
      setUnlockingLead(null);
    }
  };

  const isLeadLocked = (index: number) => {
    const plan = userData?.plan || 'free';
    return plan === 'free' && index >= 30;
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {userData?.plan === 'free' && filteredLeads.length > 30 && (
          <div className="mb-6 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                  <Lock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="font-bold text-orange-900 dark:text-orange-100 text-lg mb-2">
                    Free Plan Limit Reached
                  </h3>
                  <p className="text-orange-800 dark:text-orange-200 mb-4">
                    You've collected {filteredLeads.length} leads! The first 30 are visible on the free plan.
                    Leads 31+ are blurred but can be unlocked individually for ₹19 each, or upgrade to see all leads.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/pricing"
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Upgrade Plan
                    </Link>
                    <button
                      onClick={() => {
                        const firstLockedLead = filteredLeads[30];
                        if (firstLockedLead) handleUnlockLead(firstLockedLead.id);
                      }}
                      className="px-4 py-2 bg-white dark:bg-gray-800 text-orange-600 border border-orange-600 hover:bg-orange-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                    >
                      Unlock One Lead (₹19)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{getTableName()}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredLeads.length} lead{filteredLeads.length !== 1 ? 's' : ''} collected
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowBotFilter(!showBotFilter)}
                className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter by Bot
                <ChevronDown className="w-4 h-4 ml-2" />
              </button>

              {showBotFilter && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setSelectedBotId('all');
                        setShowBotFilter(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedBotId === 'all'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All Bots
                    </button>
                    {Object.values(bots).map(bot => (
                      <button
                        key={bot.id}
                        onClick={() => {
                          setSelectedBotId(bot.id);
                          setShowBotFilter(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedBotId === bot.id
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {bot.config?.leadsTableName || bot.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {filteredLeads.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="h-6 bg-gray-100 dark:bg-gray-700 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-12 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No leads yet</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {selectedBotId === 'all'
                ? 'Leads will appear here once visitors interact with your chatbots'
                : 'No leads collected for this bot yet'}
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Page URL
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLeads.map((lead, index) => {
                    const locked = isLeadLocked(index);
                    return (
                      <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${locked ? 'relative' : ''}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`text-sm text-gray-900 dark:text-white font-medium ${locked ? 'blur-sm' : ''}`}>
                            {lead.collectedAt?.toLocaleDateString()}
                          </div>
                          <div className={`text-xs text-gray-500 dark:text-gray-400 ${locked ? 'blur-sm' : ''}`}>
                            {lead.collectedAt?.toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm text-gray-900 dark:text-white font-medium ${locked ? 'blur-sm' : ''}`}>
                            {getLeadName(lead)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm text-gray-700 dark:text-gray-300 ${locked ? 'blur-sm' : ''}`}>
                            {getLeadEmail(lead)}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-xs">
                          <div className={`text-sm text-gray-500 dark:text-gray-400 truncate ${locked ? 'blur-sm' : ''}`} title={locked ? undefined : lead.pageUrl}>
                            {lead.pageUrl}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {locked ? (
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleUnlockLead(lead.id)}
                                disabled={unlockingLead === lead.id}
                                className="inline-flex items-center px-3 py-1.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white text-sm rounded-lg transition-colors"
                              >
                                <Lock className="w-3 h-3 mr-1" />
                                {unlockingLead === lead.id ? 'Processing...' : 'Unlock ₹19'}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setSelectedLead(lead)}
                              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                              title="View all details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedLead && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Lead Details
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {selectedLead.collectedAt?.toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Bot
                    </label>
                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                      {bots[selectedLead.botId]?.config?.leadsTableName || bots[selectedLead.botId]?.name || 'Unknown'}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Page URL
                    </label>
                    <p className="mt-1 text-sm text-blue-600 dark:text-blue-400 break-all">
                      <a href={selectedLead.pageUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {selectedLead.pageUrl}
                      </a>
                    </p>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Collected Information
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedLead.answers).map(([question, answer]) => (
                        <div key={question} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {question}
                          </label>
                          <p className="mt-1 text-sm text-gray-900 dark:text-white">
                            {answer || '-'}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
