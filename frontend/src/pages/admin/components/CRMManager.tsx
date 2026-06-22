import React, { useState } from 'react';

export default function CRMManager() {
  const [activeTab, setActiveTab] = useState<'all' | 'create'>('all');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  
  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for backend API call
    alert(`Customer account for ${customerName} (${customerEmail}) created successfully! An invitation has been sent.`);
    setCustomerEmail('');
    setCustomerName('');
    setActiveTab('all');
  };

  const mockLeads = [
    { id: '1', name: 'Harrison Fine Arts', email: 'director@harrisonfinearts.com', status: 'Qualification', tier: 'Museum Tier', date: '2d ago', value: '$14,500/mo' },
    { id: '2', name: 'Eleanor Vance', email: 'evance@private-estate.net', status: 'Contacted', tier: 'Private Collector', date: '5d ago', value: '$3,200/mo' },
    { id: '3', name: 'The Meridian Group', email: 'curation@meridianhotels.com', status: 'Closed - Won', tier: 'Corporate', date: '1w ago', value: '$22,000/mo' },
    { id: '4', name: 'Julian Cross', email: 'jcross.design@gmail.com', status: 'New Inquiry', tier: 'Collector Tier', date: '2h ago', value: 'Pending' },
  ];

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
          <button className="text-gallery-gold font-label-caps text-[10px] tracking-widest uppercase hover:text-primary transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">download</span> Export CSV
          </button>
        </div>

        {activeTab === 'all' ? (
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
              {mockLeads.map((lead) => (
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
                    <button className="font-label-caps text-[9px] tracking-widest text-gallery-gold uppercase hover:text-primary transition-colors border border-gallery-gold/30 hover:border-primary px-4 py-2">
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
