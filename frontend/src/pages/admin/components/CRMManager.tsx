import React, { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';

export default function CRMManager() {
  const [activeTab, setActiveTab] = useState<'all' | 'create'>('all');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000';
      const token = auth.currentUser ? await auth.currentUser.getIdToken() : '';
      const response = await fetch(`${apiUrl}/api/v1/crm/leads`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const result = await response.json();
        setLeads(result.data.map((lead: any) => ({
          id: lead.id,
          name: lead.contactName,
          email: lead.email,
          status: lead.status === 'new' ? 'New Inquiry' : lead.status,
          tier: lead.pipelineStage || lead.source,
          date: new Date(lead.createdAt).toLocaleDateString(),
          value: lead.companyName || 'N/A'
        })));
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newLead = {
      id: Date.now().toString(),
      name: customerName,
      email: customerEmail,
      status: 'New Inquiry',
      tier: 'Collector Tier',
      date: 'Just now',
      value: 'Pending'
    };
    
    setLeads([newLead, ...leads]);
    alert(`Customer account for ${customerName} (${customerEmail}) created successfully! An invitation has been sent.`);
    setCustomerEmail('');
    setCustomerName('');
    setActiveTab('all');
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Status', 'Tier', 'Date', 'Value'];
    const rows = leads.map(lead => [
      lead.id,
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.status}"`,
      `"${lead.tier}"`,
      `"${lead.date}"`,
      `"${lead.value}"`
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'crm_leads.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8 border-b border-gallery-gold/20 pb-4">
        <div>
          <h3 className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase mb-2">RELATIONSHIP MANAGEMENT</h3>
          <h4 className="font-display-md text-4xl tracking-tight text-primary">Leads & CRM</h4>
        </div>
        <div className="text-right">
          <p className="font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">TOTAL PIPELINE</p>
          <p className="font-display-md text-2xl text-gallery-gold tracking-tight">$39,700/mo</p>
        </div>
      </div>

      <div className="bg-white border border-gallery-gold/20 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gallery-gold/10 bg-subtle-smoke/50">
          <div className="flex gap-4">
            <button className={`font-label-caps text-[10px] tracking-widest uppercase pb-1 ${activeTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-primary/40 hover:text-primary transition-colors'}`} onClick={() => setActiveTab('all')}>All Leads</button>
            <button className={`font-label-caps text-[10px] tracking-widest uppercase pb-1 ${activeTab === 'create' ? 'text-primary border-b-2 border-primary' : 'text-primary/40 hover:text-primary transition-colors'}`} onClick={() => setActiveTab('create')}>Create Customer</button>
          </div>
          <button 
            onClick={handleExportCSV}
            className="text-gallery-gold font-label-caps text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[14px]">download</span> Export CSV
          </button>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center">
             <div className="w-8 h-8 border-2 border-gallery-gold/30 border-t-gallery-gold rounded-full animate-spin" />
          </div>
        ) : activeTab === 'all' ? (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gallery-gold/10 bg-white">
                <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Client Details</th>
                <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Status</th>
                <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Tier / Interest</th>
                <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gallery-gold/5">
              {leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-subtle-smoke transition-colors group">
                  <td className="p-6">
                    <p className="font-display-md text-lg text-primary tracking-tight group-hover:text-gallery-gold transition-colors">{lead.name}</p>
                    <p className="font-body-md text-xs text-primary/60 mt-1">{lead.email}</p>
                  </td>
                  <td className="p-6">
                    <span className={`font-label-caps text-[9px] tracking-widest uppercase px-3 py-1 border ${
                      lead.status === 'New Inquiry' ? 'bg-gallery-gold/10 border-gallery-gold/30 text-gallery-gold' :
                      lead.status === 'Closed - Won' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' :
                      'bg-primary/5 border-primary/20 text-primary/70'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="p-6">
                    <p className="font-label-caps text-[10px] tracking-widest text-primary uppercase">{lead.tier}</p>
                    <p className="font-body-md text-xs text-primary/50 mt-1">Value: {lead.value}</p>
                  </td>
                  <td className="p-6 text-right">
                    <button 
                      onClick={() => alert(`Reviewing lead: ${lead.name}`)}
                      className="font-label-caps text-[9px] tracking-widest text-gallery-gold uppercase hover:text-primary transition-colors border border-gallery-gold/30 hover:border-primary px-4 py-2 cursor-pointer"
                    >
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="p-10 max-w-2xl">
            <h4 className="font-display-md text-3xl tracking-tight text-primary mb-6">Create Customer Account</h4>
            <p className="font-body-md text-primary/60 mb-8">
              Provision a new customer account manually. This will generate a secure portal for them to view their owned pieces and request swaps.
            </p>
            <form onSubmit={handleCreateCustomer} className="space-y-6">
              <div className="border-b border-primary/20 pb-2">
                <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">Customer Full Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full bg-transparent focus:outline-none font-body-md text-lg placeholder:text-primary/30"
                  required
                />
              </div>
              <div className="border-b border-primary/20 pb-2">
                <label className="font-label-caps text-[9px] tracking-widest text-primary/60 mb-2 block uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="e.g. evance@private-estate.net"
                  className="w-full bg-transparent focus:outline-none font-body-md text-lg placeholder:text-primary/30"
                  required
                />
              </div>
              <button type="submit" className="bg-primary text-white py-3 px-8 font-label-caps text-[11px] tracking-widest uppercase transition-all hover:bg-gallery-gold shadow-sm mt-4">
                Provision Account
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
