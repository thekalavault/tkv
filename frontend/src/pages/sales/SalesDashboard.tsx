import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Award, 
  X, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Phone, 
  Briefcase, 
  Plus, 
  Filter, 
  Search, 
  Edit3, 
  Download, 
  RefreshCw, 
  Sun, 
  Moon, 
  Activity, 
  Mail, 
  UserCheck,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';
import { auth } from '../../lib/firebase';

// Interfaces matching backend models
interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface CrmActivity {
  id: string;
  leadId: string;
  userId: string;
  activityType: 'call' | 'email' | 'meeting' | 'note' | 'task';
  summary: string;
  happenedAt: string;
  details?: any;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface Lead {
  id: string;
  ownerId: string | null;
  customerId: string | null;
  status: 'new' | 'contacted' | 'proposal_sent' | 'negotiation' | 'won' | 'lost';
  source: string;
  companyName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  estimatedValueCents: number | null;
  pipelineStage: string | null;
  nextFollowUpAt: string | null;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  owner?: User | null;
  activities?: CrmActivity[];
}

interface DashboardStats {
  totalPipelineValueCents: number;
  wonValueCents: number;
  activeLeadsCount: number;
  winRate: number;
  statusCounts: Record<string, number>;
  sourceCounts: Record<string, number>;
}

// Fallback Mock Data for DX if backend connection fails
const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    ownerId: 'user-1',
    customerId: null,
    status: 'negotiation',
    source: 'Direct Referral',
    companyName: 'Reliance Industries',
    contactName: 'Aarav Mehta',
    email: 'aarav.mehta@reliance.co.in',
    phone: '+91 98765 43210',
    estimatedValueCents: 150000000,
    pipelineStage: 'negotiation',
    nextFollowUpAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    owner: { id: 'user-1', firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' },
    activities: [
      { id: 'act-1', leadId: 'lead-1', userId: 'user-1', activityType: 'note', summary: 'Negotiating contract terms & SLA', happenedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), details: { notes: 'Aarav requested a 5% discount for a 2-year lease commitment.' }, user: { firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' } },
      { id: 'act-2', leadId: 'lead-1', userId: 'user-1', activityType: 'meeting', summary: 'Presented curation catalog & mockups', happenedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), details: { location: 'Google Meet', duration: '45 mins' }, user: { firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' } }
    ]
  },
  {
    id: 'lead-2',
    ownerId: 'user-1',
    customerId: null,
    status: 'won',
    source: 'Website Inquiry',
    companyName: 'Private Estate',
    contactName: 'Priya Sharma',
    email: 'priya.sharma@gmail.com',
    phone: '+91 91234 56789',
    estimatedValueCents: 85000000,
    pipelineStage: 'won',
    nextFollowUpAt: null,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    owner: { id: 'user-1', firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' },
    activities: [
      { id: 'act-3', leadId: 'lead-2', userId: 'user-1', activityType: 'task', summary: 'Deliver & install curator pieces', happenedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), details: { installationNotes: 'All pieces securely mounted.' }, user: { firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' } }
    ]
  },
  {
    id: 'lead-3',
    ownerId: 'user-1',
    customerId: null,
    status: 'proposal_sent',
    source: 'Partner Channel',
    companyName: 'Vance Design Group',
    contactName: 'Eleanor Vance',
    email: 'evance@vancedesign.net',
    phone: '+1 212 555 0199',
    estimatedValueCents: 42000000,
    pipelineStage: 'proposal',
    nextFollowUpAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    owner: { id: 'user-1', firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' },
    activities: []
  }
];

const MOCK_STATS: DashboardStats = {
  totalPipelineValueCents: 192000000,
  wonValueCents: 85000000,
  activeLeadsCount: 2,
  winRate: 0.5,
  statusCounts: { new: 0, contacted: 0, proposal_sent: 1, negotiation: 1, won: 1, lost: 0 },
  sourceCounts: { 'Direct Referral': 1, 'Website Inquiry': 1, 'Partner Channel': 1 }
};

export default function SalesDashboard() {
  // Stale-While-Revalidate Caching: Initialize state directly from localStorage if available
  const [leads, setLeads] = useState<Lead[]>(() => {
    const cached = localStorage.getItem('kb_cached_leads');
    return cached ? JSON.parse(cached) : [];
  });
  const [stats, setStats] = useState<DashboardStats | null>(() => {
    const cached = localStorage.getItem('kb_cached_stats');
    return cached ? JSON.parse(cached) : null;
  });

  // If cached data is available, do not show full-page loading spinner/skeletons, but set background refreshing.
  const [loading, setLoading] = useState(() => {
    const cachedLeads = localStorage.getItem('kb_cached_leads');
    return !cachedLeads; // only show initial loader if no cache
  });

  const [backgroundRefreshing, setBackgroundRefreshing] = useState(false);
  const [isWakingUp, setIsWakingUp] = useState(false); // Detects Render backend cold start (>1.5s delay)

  // Split Screen UI & Details State
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadDetailsLoading, setLeadDetailsLoading] = useState(false);
  const [sidePanelTab, setSidePanelTab] = useState<'details' | 'activities'>('details');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add Lead Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    companyName: '',
    source: 'Website Inquiry',
    status: 'new',
    estimatedValueINR: '',
    pipelineStage: 'general',
    nextFollowUpAt: '',
    notes: ''
  });

  // Edit Lead fields inside panel
  const [editForm, setEditForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    companyName: '',
    status: 'new',
    source: 'Website Inquiry',
    estimatedValueINR: '',
    pipelineStage: 'general',
    nextFollowUpAt: '',
    ownerId: ''
  });

  // Log Activity State
  const [newActivity, setNewActivity] = useState({
    activityType: 'call',
    summary: '',
    details: ''
  });
  const [loggingActivity, setLoggingActivity] = useState(false);

  // Team users for assignment
  const [teamUsers, setTeamUsers] = useState<User[]>([]);

  // Theme support
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Formatter helpers
  const formatINR = (cents: number | null) => {
    if (cents === null || cents === undefined) return '₹ 0';
    const rupees = cents / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(rupees);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Get auth headers
  const getAuthHeaders = async () => {
    const token = localStorage.getItem('kalavault_token') || 'offline-admin-token';
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const getApiUrl = () => {
    return import.meta.env.VITE_API_URL || 'http://localhost:4000';
  };

  // Data Fetching
  const loadDashboardData = async (manualRefresh = false) => {
    // If no cache, we show full skeletons. If cache, we do background sync.
    const hasCache = localStorage.getItem('kb_cached_leads');
    if (!hasCache || manualRefresh) {
      setLoading(true);
    } else {
      setBackgroundRefreshing(true);
    }

    // Set 1.5s timeout to detect Render cold start waking up
    const wakingTimer = setTimeout(() => {
      setIsWakingUp(true);
    }, 1500);

    try {
      const headers = await getAuthHeaders();
      const apiUrl = getApiUrl();

      // Parallel fetch leads, stats and team users
      const [leadsRes, statsRes, usersRes] = await Promise.all([
        fetch(`${apiUrl}/api/v1/crm/leads`, { headers }),
        fetch(`${apiUrl}/api/v1/crm/stats`, { headers }),
        fetch(`${apiUrl}/api/v1/users?limit=50`, { headers }).catch(() => null)
      ]);

      clearTimeout(wakingTimer);
      setIsWakingUp(false);

      if (leadsRes.ok && statsRes.ok) {
        const leadsData = await leadsRes.json();
        const statsData = await statsRes.json();
        
        const freshLeads = leadsData.data || [];
        const freshStats = statsData.data || null;

        setLeads(freshLeads);
        setStats(freshStats);

        // Save to cache for next load
        localStorage.setItem('kb_cached_leads', JSON.stringify(freshLeads));
        localStorage.setItem('kb_cached_stats', JSON.stringify(freshStats));
      } else {
        throw new Error('Server returned non-200 responses');
      }

      if (usersRes && usersRes.ok) {
        const usersData = await usersRes.json();
        setTeamUsers(usersData.items || []);
      } else {
        setTeamUsers([
          { id: 'user-1', firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' }
        ]);
      }
    } catch (err) {
      console.warn('Backend connection failed or timed out. Falling back to local cache or mock data.', err);
      clearTimeout(wakingTimer);
      setIsWakingUp(false);

      // If we don't have cache, set mock data
      if (!hasCache) {
        setLeads(MOCK_LEADS);
        setStats(MOCK_STATS);
        localStorage.setItem('kb_cached_leads', JSON.stringify(MOCK_LEADS));
        localStorage.setItem('kb_cached_stats', JSON.stringify(MOCK_STATS));
      }
      setTeamUsers([
        { id: 'user-1', firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' }
      ]);
    } finally {
      setLoading(false);
      setBackgroundRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Selected Lead Details Sync
  useEffect(() => {
    if (!selectedLeadId) {
      setSelectedLead(null);
      return;
    }

    const fetchLeadDetails = async () => {
      setLeadDetailsLoading(true);
      try {
        const headers = await getAuthHeaders();
        const apiUrl = getApiUrl();
        const res = await fetch(`${apiUrl}/api/v1/crm/leads/${selectedLeadId}`, { headers });
        if (res.ok) {
          const data = await res.json();
          const leadData: Lead = data.data;
          setSelectedLead(leadData);
          
          // Populate edit form
          setEditForm({
            contactName: leadData.contactName || '',
            email: leadData.email || '',
            phone: leadData.phone || '',
            companyName: leadData.companyName || '',
            status: leadData.status || 'new',
            source: leadData.source || 'Website Inquiry',
            estimatedValueINR: leadData.estimatedValueCents ? (leadData.estimatedValueCents / 100).toString() : '',
            pipelineStage: leadData.pipelineStage || 'general',
            nextFollowUpAt: leadData.nextFollowUpAt ? new Date(leadData.nextFollowUpAt).toISOString().split('T')[0] : '',
            ownerId: leadData.ownerId || ''
          });
        }
      } catch (err) {
        // Fallback mapping
        const localLead = leads.find(l => l.id === selectedLeadId);
        if (localLead) {
          setSelectedLead(localLead);
          setEditForm({
            contactName: localLead.contactName || '',
            email: localLead.email || '',
            phone: localLead.phone || '',
            companyName: localLead.companyName || '',
            status: localLead.status || 'new',
            source: localLead.source || 'Website Inquiry',
            estimatedValueINR: localLead.estimatedValueCents ? (localLead.estimatedValueCents / 100).toString() : '',
            pipelineStage: localLead.pipelineStage || 'general',
            nextFollowUpAt: localLead.nextFollowUpAt ? new Date(localLead.nextFollowUpAt).toISOString().split('T')[0] : '',
            ownerId: localLead.ownerId || ''
          });
        }
      } finally {
        setLeadDetailsLoading(false);
      }
    };

    fetchLeadDetails();
  }, [selectedLeadId, leads]);

  // Lead CRUD Operations
  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const headers = await getAuthHeaders();
      const apiUrl = getApiUrl();
      const payload = {
        contactName: newLeadForm.contactName,
        email: newLeadForm.email,
        phone: newLeadForm.phone || null,
        companyName: newLeadForm.companyName || null,
        source: newLeadForm.source,
        status: newLeadForm.status,
        estimatedValueCents: newLeadForm.estimatedValueINR ? Number(newLeadForm.estimatedValueINR) * 100 : null,
        pipelineStage: newLeadForm.pipelineStage,
        nextFollowUpAt: newLeadForm.nextFollowUpAt || null,
        metadata: newLeadForm.notes ? { notes: newLeadForm.notes } : {}
      };

      const res = await fetch(`${apiUrl}/api/v1/crm/leads`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const result = await res.json();
        const createdLead: Lead = result.data;
        
        if (newLeadForm.notes && createdLead.id) {
          await fetch(`${apiUrl}/api/v1/crm/leads/${createdLead.id}/activities`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              activityType: 'note',
              summary: 'Initial Curation Note added during lead creation',
              details: { notes: newLeadForm.notes }
            })
          }).catch(() => null);
        }

        setIsAddModalOpen(false);
        setNewLeadForm({
          contactName: '',
          email: '',
          phone: '',
          companyName: '',
          source: 'Website Inquiry',
          status: 'new',
          estimatedValueINR: '',
          pipelineStage: 'general',
          nextFollowUpAt: '',
          notes: ''
        });
        loadDashboardData(true);
      } else {
        alert('Failed to save lead. Please check inputs.');
      }
    } catch (err) {
      // Local Mock Addition for offline use
      const mockNewLead: Lead = {
        id: `mock-lead-${Date.now()}`,
        ownerId: 'user-1',
        customerId: null,
        status: newLeadForm.status as any,
        source: newLeadForm.source,
        companyName: newLeadForm.companyName || null,
        contactName: newLeadForm.contactName,
        email: newLeadForm.email,
        phone: newLeadForm.phone || null,
        estimatedValueCents: newLeadForm.estimatedValueINR ? Number(newLeadForm.estimatedValueINR) * 100 : null,
        pipelineStage: newLeadForm.pipelineStage,
        nextFollowUpAt: newLeadForm.nextFollowUpAt || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        owner: teamUsers.find(u => u.id === 'user-1') || null,
        activities: newLeadForm.notes ? [{
          id: `mock-act-${Date.now()}`,
          leadId: `mock-lead-${Date.now()}`,
          userId: 'user-1',
          activityType: 'note',
          summary: 'Initial Curation Note added during lead creation',
          happenedAt: new Date().toISOString(),
          details: { notes: newLeadForm.notes },
          user: { firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' }
        }] : []
      };

      const updatedLeads = [mockNewLead, ...leads];
      setLeads(updatedLeads);
      localStorage.setItem('kb_cached_leads', JSON.stringify(updatedLeads));
      setIsAddModalOpen(false);
      alert('Mock Lead created locally (offline mode).');
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId) return;

    try {
      const headers = await getAuthHeaders();
      const apiUrl = getApiUrl();
      const payload = {
        contactName: editForm.contactName,
        email: editForm.email,
        phone: editForm.phone || null,
        companyName: editForm.companyName || null,
        status: editForm.status,
        source: editForm.source,
        estimatedValueCents: editForm.estimatedValueINR ? Number(editForm.estimatedValueINR) * 100 : null,
        pipelineStage: editForm.pipelineStage,
        nextFollowUpAt: editForm.nextFollowUpAt || null,
        ownerId: editForm.ownerId || ''
      };

      const res = await fetch(`${apiUrl}/api/v1/crm/leads/${selectedLeadId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        loadDashboardData(true);
        // Refresh selected lead detail view
        const refreshedRes = await fetch(`${apiUrl}/api/v1/crm/leads/${selectedLeadId}`, { headers });
        if (refreshedRes.ok) {
          const freshData = await refreshedRes.json();
          setSelectedLead(freshData.data);
        }
      } else {
        alert('Failed to update lead');
      }
    } catch (err) {
      // Local Mock Update
      const updatedLeads = leads.map(l => {
        if (l.id === selectedLeadId) {
          return {
            ...l,
            contactName: editForm.contactName,
            email: editForm.email,
            phone: editForm.phone || null,
            companyName: editForm.companyName || null,
            status: editForm.status as any,
            source: editForm.source,
            estimatedValueCents: editForm.estimatedValueINR ? Number(editForm.estimatedValueINR) * 100 : null,
            pipelineStage: editForm.pipelineStage,
            nextFollowUpAt: editForm.nextFollowUpAt || null,
            ownerId: editForm.ownerId || null,
            owner: teamUsers.find(u => u.id === editForm.ownerId) || null,
            updatedAt: new Date().toISOString()
          };
        }
        return l;
      });
      setLeads(updatedLeads);
      localStorage.setItem('kb_cached_leads', JSON.stringify(updatedLeads));
      alert('Mock Lead updated locally.');
    }
  };

  // Activity Logging
  const handleLogActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeadId || !newActivity.summary) return;

    setLoggingActivity(true);
    try {
      const headers = await getAuthHeaders();
      const apiUrl = getApiUrl();
      const payload = {
        activityType: newActivity.activityType,
        summary: newActivity.summary,
        details: newActivity.details ? { notes: newActivity.details } : {}
      };

      const res = await fetch(`${apiUrl}/api/v1/crm/leads/${selectedLeadId}/activities`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewActivity({ activityType: 'call', summary: '', details: '' });
        // Refresh selected lead details to retrieve new activity list
        const refreshedRes = await fetch(`${apiUrl}/api/v1/crm/leads/${selectedLeadId}`, { headers });
        if (refreshedRes.ok) {
          const freshData = await refreshedRes.json();
          setSelectedLead(freshData.data);
        }
      }
    } catch (err) {
      // Local Activity Append
      if (selectedLead) {
        const mockAct: CrmActivity = {
          id: `mock-act-${Date.now()}`,
          leadId: selectedLeadId,
          userId: 'user-1',
          activityType: newActivity.activityType as any,
          summary: newActivity.summary,
          happenedAt: new Date().toISOString(),
          details: newActivity.details ? { notes: newActivity.details } : {},
          user: { firstName: 'Kala', lastName: 'Vault', email: 'admin@thekalavault.com' }
        };

        const updatedLead = {
          ...selectedLead,
          activities: [mockAct, ...(selectedLead.activities || [])]
        };

        setSelectedLead(updatedLead);
        
        // Update master lead list
        const updatedLeads = leads.map(l => l.id === selectedLeadId ? updatedLead : l);
        setLeads(updatedLeads);
        localStorage.setItem('kb_cached_leads', JSON.stringify(updatedLeads));
        setNewActivity({ activityType: 'call', summary: '', details: '' });
        alert('Activity logged locally.');
      }
    } finally {
      setLoggingActivity(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Lead ID', 'Client Name', 'Company Name', 'Email', 'Phone', 'Source', 'Status', 'Pipeline Stage', 'Value (INR)', 'Next Follow-up', 'Created Date'];
    const rows = leads.map(l => [
      l.id,
      `"${l.contactName}"`,
      `"${l.companyName || '-'}"`,
      `"${l.email}"`,
      `"${l.phone || '-'}"`,
      `"${l.source}"`,
      `"${l.status}"`,
      `"${l.pipelineStage || 'general'}"`,
      l.estimatedValueCents ? l.estimatedValueCents / 100 : 0,
      `"${l.nextFollowUpAt ? new Date(l.nextFollowUpAt).toISOString().split('T')[0] : '-'}"`,
      `"${new Date(l.createdAt).toISOString().split('T')[0]}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sales_leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters & Searching
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.companyName && lead.companyName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;

    return matchesSearch && matchesStatus && matchesSource;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Sync pagination index if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, sourceFilter]);

  // Unique sources list for filter dropdown
  const uniqueSources = Array.from(new Set(leads.map(l => l.source))).filter(Boolean);

  // ECharts Configurations
  // 1. Pipeline Funnel/Stage Bar configuration
  const getPipelineChartOption = () => {
    const stages = {
      new: 0,
      contacted: 0,
      proposal_sent: 0,
      negotiation: 0,
      won: 0,
      lost: 0
    };

    leads.forEach(l => {
      if (l.status in stages) {
        stages[l.status]++;
      }
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
        borderColor: isDark ? '#1e1e24' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'Inter, sans-serif' }
      },
      grid: { left: '3%', right: '4%', bottom: '3%', top: '5%', containLabel: true },
      xAxis: {
        type: 'value',
        axisLabel: { color: isDark ? '#71717a' : '#71717a' },
        splitLine: { lineStyle: { color: isDark ? '#1e1e24' : '#f4f4f5' } }
      },
      yAxis: {
        type: 'category',
        data: ['New', 'Contacted', 'Proposal Sent', 'Negotiation', 'Closed Won', 'Closed Lost'],
        axisLabel: { color: isDark ? '#fafafa' : '#09090b', fontWeight: '500' },
        axisLine: { lineStyle: { color: isDark ? '#1e1e24' : '#e4e4e7' } }
      },
      series: [
        {
          name: 'Leads',
          type: 'bar',
          data: [stages.new, stages.contacted, stages.proposal_sent, stages.negotiation, stages.won, stages.lost],
          itemStyle: {
            color: (params: any) => {
              const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];
              return colors[params.dataIndex];
            },
            borderRadius: [0, 4, 4, 0]
          },
          barWidth: '60%'
        }
      ]
    };
  };

  // 2. Lead Source Pie/Doughnut configuration
  const getSourceChartOption = () => {
    const sources: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.source || 'Website Inquiry';
      sources[src] = (sources[src] || 0) + 1;
    });

    const chartData = Object.entries(sources).map(([name, value]) => ({
      name,
      value
    }));

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: isDark ? '#0c0c0f' : '#ffffff',
        borderColor: isDark ? '#1e1e24' : '#e4e4e7',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'Inter, sans-serif' }
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: { color: isDark ? '#fafafa' : '#09090b', fontFamily: 'Inter, sans-serif' },
        padding: [20, 0, 0, 0]
      },
      series: [
        {
          name: 'Lead Source',
          type: 'pie',
          radius: ['45%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: isDark ? '#0c0c0f' : '#ffffff',
            borderWidth: 2
          },
          label: { show: false },
          labelLine: { show: false },
          color: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4"],
          data: chartData
        }
      ]
    };
  };

  // Calculate maximum lead value for sparklines
  const maxLeadValueCents = Math.max(...leads.map(l => l.estimatedValueCents || 0), 10000000);

  return (
    <div className={`min-h-screen font-body-md flex flex-col pt-16 md:pt-24 transition-colors duration-300 ${isDark ? 'bg-[#09090b] text-[#fafafa]' : 'bg-[#fbf9f5] text-[#09090b]'}`}>
      <TopNavBar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-6 md:px-12 py-10">
        
        {/* Render Backend Cold Start Alert Banner */}
        <AnimatePresence>
          {isWakingUp && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 flex items-start gap-3 shadow-sm"
            >
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 animate-bounce" />
              <div className="flex-1">
                <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Render Cloud Server Waking Up</h4>
                <p className="text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                  The API backend server on the Render Free Tier is spin-down due to inactivity. We are waking it up now. This first request takes up to <strong>50 seconds</strong> to establish a connection. Thank you for your patience—the page will reload automatically once ready.
                </p>
              </div>
              <div className="flex-shrink-0 flex items-center h-full">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Premium Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 border-b pb-6 transition-colors duration-300 border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.2em] font-bold">
                Kala Vault Intelligence
              </span>
              <div className="h-[1px] w-8 bg-gallery-gold/40" />
              
              {/* Syncing/Updating status indicators */}
              {backgroundRefreshing ? (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Syncing latest data...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Active Sandbox</span>
                </div>
              )}
            </div>
            <h1 className="font-display-lg text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
              Sales <span className="italic font-light text-gallery-gold font-serif">Intelligence</span> Portal
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Manage client leasing portfolios, revenue forecast, and pipeline rotation.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className="p-3 border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-5 h-5 text-gallery-gold" /> : <Moon className="w-5 h-5 text-zinc-600" />}
            </button>

            <button
              onClick={() => loadDashboardData(true)}
              className="p-3 border rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 border-zinc-200 dark:border-zinc-800 transition-colors"
              title="Force Sync"
              disabled={backgroundRefreshing || loading}
            >
              <RefreshCw className={`w-5 h-5 text-zinc-500 ${(backgroundRefreshing || loading) && 'animate-spin'}`} />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-[#059669] hover:bg-[#047857] text-white rounded-xl px-5 py-3 font-semibold shadow-sm transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Lead</span>
            </button>
          </div>
        </div>

        {/* Dashboard Statistics Cards */}
        {loading ? (
          /* SKELETON LOADER FOR STAT CARDS */
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                  <div className="h-8 w-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg animate-pulse" />
                </div>
                <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3.5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {/* Total Pipeline */}
            <div className="bg-white dark:bg-[#0c0c0f] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest">Active Pipeline</span>
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="font-mono text-2xl font-bold tracking-tight mb-1 text-zinc-950 dark:text-zinc-50">
                {formatINR(stats?.totalPipelineValueCents || 0)}
              </p>
              <p className="text-xs text-zinc-500">Value of outstanding leads</p>
            </div>

            {/* Won Revenue */}
            <div className="bg-white dark:bg-[#0c0c0f] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest">Closed Won YTD</span>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-lg">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="font-mono text-2xl font-bold tracking-tight mb-1 text-zinc-950 dark:text-zinc-50">
                {formatINR(stats?.wonValueCents || 0)}
              </p>
              <p className="text-xs text-zinc-500">Successfully leased portfolio value</p>
            </div>

            {/* Active Leads */}
            <div className="bg-white dark:bg-[#0c0c0f] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest">Active Leads</span>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-bold tracking-tight mb-1 text-zinc-950 dark:text-zinc-50">
                {stats?.activeLeadsCount || 0} <span className="text-xs font-normal text-zinc-500">Leads</span>
              </p>
              <p className="text-xs text-zinc-500">Currently in discussion stages</p>
            </div>

            {/* Win Rate */}
            <div className="bg-white dark:bg-[#0c0c0f] p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />
              <div className="flex justify-between items-start mb-4">
                <span className="font-label-caps text-[10px] text-zinc-500 uppercase tracking-widest">Lead Conversion</span>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-lg">
                  <Award className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline gap-2 mb-1">
                <p className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
                  {Math.round((stats?.winRate || 0) * 100)}%
                </p>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-0.5">
                  +4% <TrendingUp className="w-2.5 h-2.5" />
                </span>
              </div>
              <p className="text-xs text-zinc-500">Ratio of won to closed leads</p>
            </div>
          </div>
        )}

        {/* Analytical Charts Row */}
        {loading ? (
          /* SKELETON LOADER FOR CHARTS */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[1, 2].map(n => (
              <div key={n} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm flex flex-col gap-4">
                <div className="h-5 w-40 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-3 w-60 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
                <div className="h-[250px] bg-zinc-100 dark:bg-zinc-900/50 rounded-lg animate-pulse flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-zinc-300 dark:text-zinc-700 animate-spin" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Stage distribution bar chart */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">Pipeline Stage Distribution</h3>
                <p className="text-xs text-zinc-500">Leads counts across stages</p>
              </div>
              <div className="h-[260px] w-full">
                <ReactECharts option={getPipelineChartOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>

            {/* Ingestion channels pie chart */}
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
              <div className="mb-4">
                <h3 className="text-base font-bold text-zinc-950 dark:text-zinc-50">Lead Ingestion Channels</h3>
                <p className="text-xs text-zinc-500">Ingestion split from marketing channels</p>
              </div>
              <div className="h-[260px] w-full">
                <ReactECharts option={getSourceChartOption()} style={{ height: '100%', width: '100%' }} />
              </div>
            </div>
          </div>
        )}

        {/* Primary Leads & CRM List Area */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          
          {/* Main Leads Table Card */}
          <div className={`bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden transition-all duration-300 ${selectedLeadId ? 'w-full lg:w-2/3' : 'w-full'}`}>
            
            {/* Table Toolbar */}
            <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-zinc-50/50 dark:bg-zinc-900/10">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Leads Pipeline</h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                  {filteredLeads.length} total
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Search */}
                <div className="relative w-full sm:w-60">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search client, company..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="proposal_sent">Proposal Sent</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="won">Closed Won</option>
                    <option value="lost">Closed Lost</option>
                  </select>
                </div>

                {/* Source Filter */}
                <div className="relative">
                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                  >
                    <option value="all">All Sources</option>
                    {uniqueSources.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>

                {/* CSV Export Button */}
                <button
                  onClick={handleExportCSV}
                  className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-600 dark:text-zinc-300"
                  title="Export CSV"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto">
              {loading ? (
                /* SKELETON LOADER FOR TABLE ROWS */
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-zinc-500 dark:text-zinc-400 font-label-caps text-[10px] uppercase tracking-widest">
                      <th className="p-4 pl-6 font-normal">Client details</th>
                      <th className="p-4 font-normal">Channel</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Est. Portfolio Value</th>
                      <th className="p-4 pr-6 text-right font-normal">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                    {[1, 2, 3, 4, 5].map(n => (
                      <tr key={n} className="animate-pulse">
                        <td className="p-4 pl-6">
                          <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
                          <div className="h-3 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </td>
                        <td className="p-4">
                          <div className="h-5 w-24 bg-zinc-200 dark:bg-zinc-800 rounded" />
                        </td>
                        <td className="p-4">
                          <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded mb-1.5" />
                          <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full" />
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="h-4 w-20 bg-zinc-200 dark:bg-zinc-800 rounded ml-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : paginatedLeads.length === 0 ? (
                <div className="py-20 text-center border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/10 dark:bg-zinc-900/5">
                  <p className="text-zinc-500">No matching leads found.</p>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 text-zinc-500 dark:text-zinc-400 font-label-caps text-[10px] uppercase tracking-widest">
                      <th className="p-4 pl-6 font-normal">Client details</th>
                      <th className="p-4 font-normal">Channel</th>
                      <th className="p-4 font-normal">Status</th>
                      <th className="p-4 font-normal">Est. Portfolio Value</th>
                      <th className="p-4 pr-6 text-right font-normal">Next Follow-up</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
                    {paginatedLeads.map((lead) => {
                      const isActive = lead.id === selectedLeadId;
                      return (
                        <tr
                          key={lead.id}
                          onClick={() => setSelectedLeadId(isActive ? null : lead.id)}
                          className={`cursor-pointer transition-colors duration-200 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 ${isActive ? 'bg-blue-50/60 dark:bg-blue-950/20' : ''}`}
                        >
                          <td className="p-4 pl-6">
                            <p className="font-semibold text-zinc-900 dark:text-zinc-50">{lead.contactName}</p>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{lead.companyName || lead.email}</p>
                          </td>
                          <td className="p-4 text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/50">
                              {lead.source}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                              lead.status === 'new' ? 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' :
                              lead.status === 'contacted' ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400' :
                              lead.status === 'proposal_sent' ? 'bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400' :
                              lead.status === 'negotiation' ? 'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400' :
                              lead.status === 'won' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400' :
                              'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                            }`}>
                              {lead.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-semibold text-zinc-950 dark:text-zinc-100">
                            <div className="flex flex-col gap-1.5 max-w-[120px]">
                              <span>{formatINR(lead.estimatedValueCents)}</span>
                              {/* Sparkline progress indicator bar */}
                              <div className="h-1.5 w-full bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${
                                    lead.status === 'won' ? 'bg-emerald-500' :
                                    lead.status === 'lost' ? 'bg-zinc-400' :
                                    ['negotiation', 'proposal_sent'].includes(lead.status) ? 'bg-amber-500' : 'bg-blue-500'
                                  }`} 
                                  style={{ width: `${Math.min(100, Math.max(10, ((lead.estimatedValueCents || 0) / maxLeadValueCents) * 100))}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="p-4 pr-6 text-right text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                            {lead.nextFollowUpAt ? (
                              <span className="flex items-center justify-end gap-1 text-amber-600 dark:text-amber-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {formatDate(lead.nextFollowUpAt)}
                              </span>
                            ) : (
                              <span className="text-zinc-400">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-5 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/30 dark:bg-zinc-900/5">
              <span className="text-xs text-zinc-500">
                Showing Page {currentPage} of {totalPages} ({filteredLeads.length} leads)
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-1.5 border border-zinc-200 dark:border-zinc-800 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-zinc-600 dark:text-zinc-300"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Investigation / Details Side Panel */}
          <AnimatePresence>
            {selectedLeadId && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="w-full lg:w-1/3 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm overflow-hidden flex flex-col h-[750px]"
              >
                {/* Panel Header */}
                <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div>
                    <h3 className="font-bold text-zinc-950 dark:text-zinc-50">Lead File</h3>
                    <p className="text-xs font-mono text-zinc-500">ID: {selectedLeadId.substring(0, 8)}...</p>
                  </div>
                  <button
                    onClick={() => setSelectedLeadId(null)}
                    className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg text-zinc-500 dark:text-zinc-400 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Sub Tab headers */}
                <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f]">
                  <button
                    onClick={() => setSidePanelTab('details')}
                    className={`flex-1 py-3 text-center text-xs font-bold font-label-caps uppercase tracking-wider border-b-2 transition-all ${
                      sidePanelTab === 'details'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setSidePanelTab('activities')}
                    className={`flex-1 py-3 text-center text-xs font-bold font-label-caps uppercase tracking-wider border-b-2 transition-all ${
                      sidePanelTab === 'activities'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-zinc-500 hover:text-zinc-700'
                    }`}
                  >
                    Activity Log ({selectedLead?.activities?.length || 0})
                  </button>
                </div>

                {/* Tab content area */}
                <div className="flex-1 overflow-y-auto p-5 hide-scrollbar">
                  {leadDetailsLoading ? (
                    <div className="py-20 text-center text-sm text-zinc-500 animate-pulse">Synchronizing lead file...</div>
                  ) : sidePanelTab === 'details' ? (
                    /* EDIT DETAILS FORM */
                    <form onSubmit={handleUpdateLead} className="space-y-5">
                      {/* Name */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Client Full Name</label>
                        <input
                          type="text"
                          value={editForm.contactName}
                          onChange={(e) => setEditForm({ ...editForm, contactName: e.target.value })}
                          className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          required
                        />
                      </div>

                      {/* Email / Phone grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email Address</label>
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Phone</label>
                          <input
                            type="text"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Company / Corporation</label>
                        <input
                          type="text"
                          value={editForm.companyName}
                          onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })}
                          className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                      </div>

                      {/* Status / Stage Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Lead Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                            className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="proposal_sent">Proposal Sent</option>
                            <option value="negotiation">Negotiation</option>
                            <option value="won">Closed Won</option>
                            <option value="lost">Closed Lost</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Stage</label>
                          <input
                            type="text"
                            value={editForm.pipelineStage}
                            onChange={(e) => setEditForm({ ...editForm, pipelineStage: e.target.value })}
                            className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          />
                        </div>
                      </div>

                      {/* Est Value / Follow Up Date */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Est Value (INR)</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold">₹</span>
                            <input
                              type="number"
                              value={editForm.estimatedValueINR}
                              onChange={(e) => setEditForm({ ...editForm, estimatedValueINR: e.target.value })}
                              placeholder="e.g. 150000"
                              className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-6 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 font-mono"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Next Follow-up</label>
                          <input
                            type="date"
                            value={editForm.nextFollowUpAt}
                            onChange={(e) => setEditForm({ ...editForm, nextFollowUpAt: e.target.value })}
                            className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                          />
                        </div>
                      </div>

                      {/* Assignee / Owner */}
                      <div>
                        <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Lead Owner</label>
                        <select
                          value={editForm.ownerId}
                          onChange={(e) => setEditForm({ ...editForm, ownerId: e.target.value })}
                          className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                        >
                          <option value="">Unassigned</option>
                          {teamUsers.map(user => (
                            <option key={user.id} value={user.id}>
                              {user.firstName} {user.lastName} ({user.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Action buttons */}
                      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex gap-3">
                        <button
                          type="submit"
                          className="flex-1 bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-4 py-2.5 font-bold transition-colors shadow-sm"
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  ) : (
                    /* ACTIVITIES TAB */
                    <div className="space-y-6">
                      
                      {/* Log activity form */}
                      <form onSubmit={handleLogActivity} className="p-4 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-4">
                        <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-500" /> Log New Sales Activity
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Type</label>
                            <select
                              value={newActivity.activityType}
                              onChange={(e) => setNewActivity({ ...newActivity, activityType: e.target.value })}
                              className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                            >
                              <option value="call">Call</option>
                              <option value="email">Email</option>
                              <option value="meeting">Meeting</option>
                              <option value="note">Note / Memo</option>
                              <option value="task">Task / To-Do</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Brief Summary</label>
                            <input
                              type="text"
                              placeholder="e.g. Sent price deck"
                              value={newActivity.summary}
                              onChange={(e) => setNewActivity({ ...newActivity, summary: e.target.value })}
                              className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Details & Remarks</label>
                          <textarea
                            rows={2}
                            placeholder="Write down conversation points or internal notes..."
                            value={newActivity.details}
                            onChange={(e) => setNewActivity({ ...newActivity, details: e.target.value })}
                            className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={loggingActivity}
                          className="w-full bg-[#059669] hover:bg-[#047857] text-white text-xs py-2 rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50"
                        >
                          {loggingActivity ? 'Saving...' : 'Log Activity'}
                        </button>
                      </form>

                      {/* Activities Timeline */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Activity History</h4>
                        
                        {!selectedLead?.activities || selectedLead.activities.length === 0 ? (
                          <div className="text-center py-8 bg-zinc-50/40 dark:bg-zinc-900/10 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
                            <p className="text-xs text-zinc-400">No activities logged for this lead yet.</p>
                          </div>
                        ) : (
                          <div className="relative border-l border-zinc-200 dark:border-zinc-800 pl-4 ml-2 space-y-5 py-2">
                            {selectedLead.activities.map((act) => (
                              <div key={act.id} className="relative group">
                                {/* Bullet node */}
                                <div className="absolute -left-[21px] top-1.5 p-1 bg-white dark:bg-[#0c0c0f] border border-zinc-300 dark:border-zinc-700 rounded-full z-10">
                                  {act.activityType === 'call' && <Phone className="w-3.5 h-3.5 text-amber-500" />}
                                  {act.activityType === 'email' && <Mail className="w-3.5 h-3.5 text-blue-500" />}
                                  {act.activityType === 'meeting' && <MessageSquare className="w-3.5 h-3.5 text-purple-500" />}
                                  {act.activityType === 'note' && <FileText className="w-3.5 h-3.5 text-green-500" />}
                                  {act.activityType === 'task' && <UserCheck className="w-3.5 h-3.5 text-emerald-500" />}
                                </div>

                                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg p-3">
                                  <div className="flex justify-between items-start gap-2 mb-1.5">
                                    <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-50 capitalize">
                                      {act.summary}
                                    </h5>
                                    <span className="text-[10px] text-zinc-400 flex items-center gap-1 font-mono">
                                      <Clock className="w-3 h-3" />
                                      {formatDate(act.happenedAt)}
                                    </span>
                                  </div>
                                  
                                  {act.details?.notes && (
                                    <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed mb-1 bg-white dark:bg-zinc-950 p-2 rounded border border-zinc-100 dark:border-zinc-900">
                                      {act.details.notes}
                                    </p>
                                  )}

                                  <div className="flex items-center justify-end text-[9px] text-zinc-400">
                                    <span>Logged by: {act.user?.firstName || 'Staff'} {act.user?.lastName || ''}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Add Lead Dialog Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xl w-full max-w-lg p-6 relative z-10 overflow-hidden"
            >
              <div className="flex justify-between items-center border-b pb-4 mb-4 border-zinc-200 dark:border-zinc-800">
                <h3 className="font-bold text-lg text-zinc-950 dark:text-zinc-50">Create New CRM Lead</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full text-zinc-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateLead} className="space-y-4">
                {/* Client Name */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Client Full Name *</label>
                  <input
                    type="text"
                    value={newLeadForm.contactName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, contactName: e.target.value })}
                    placeholder="e.g. Elena Rostova"
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    required
                  />
                </div>

                {/* Email / Phone grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Email *</label>
                    <input
                      type="email"
                      value={newLeadForm.email}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                      placeholder="client@mail.com"
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      value={newLeadForm.phone}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                      placeholder="+91 99999 88888"
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Company Name</label>
                  <input
                    type="text"
                    value={newLeadForm.companyName}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                    placeholder="e.g. Sterling Ventures"
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  />
                </div>

                {/* Channel / Status */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Ingestion Channel</label>
                    <select
                      value={newLeadForm.source}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value })}
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    >
                      <option value="Website Inquiry">Website Inquiry</option>
                      <option value="Direct Referral">Direct Referral</option>
                      <option value="Partner Channel">Partner Channel</option>
                      <option value="Cold Outreach">Cold Outreach</option>
                      <option value="Exhibition Event">Exhibition Event</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Initial Status</label>
                    <select
                      value={newLeadForm.status}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, status: e.target.value })}
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="proposal_sent">Proposal Sent</option>
                      <option value="negotiation">Negotiation</option>
                    </select>
                  </div>
                </div>

                {/* Estimated Value / Follow up */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Est Value (INR)</label>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400 font-bold">₹</span>
                      <input
                        type="number"
                        value={newLeadForm.estimatedValueINR}
                        onChange={(e) => setNewLeadForm({ ...newLeadForm, estimatedValueINR: e.target.value })}
                        placeholder="e.g. 500000"
                        className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-6 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Follow Up Date</label>
                    <input
                      type="date"
                      value={newLeadForm.nextFollowUpAt}
                      onChange={(e) => setNewLeadForm({ ...newLeadForm, nextFollowUpAt: e.target.value })}
                      className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
                    />
                  </div>
                </div>

                {/* Curation Notes */}
                <div>
                  <label className="block text-xs font-medium text-zinc-500 mb-1.5 uppercase tracking-wider">Curation Notes / Requirement details</label>
                  <textarea
                    rows={3}
                    value={newLeadForm.notes}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                    placeholder="e.g. Client needs 3 matching abstract paintings for corporate hallway..."
                    className="w-full bg-[#ffffff] dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 justify-end pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="bg-[#ffffff] dark:bg-[#262626] hover:bg-[#f8fafc] dark:hover:bg-zinc-800 text-[#334155] dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 font-bold transition-colors shadow-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#059669] hover:bg-[#047857] text-white rounded-lg px-5 py-2.5 font-bold transition-colors shadow-sm"
                  >
                    Create Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
