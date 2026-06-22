import React from 'react';

export default function ContractManager() {
  const mockContracts = [
    { id: 'CON-8821', client: 'Harrison Fine Arts', artwork: 'KV-AB-001 (Urban Tectonic II)', startDate: '2026-05-01', endDate: '2026-11-01', status: 'Active Lease', amount: '$14,500' },
    { id: 'CON-8822', client: 'The Meridian Group', artwork: 'KV-PA-045 (Monsoon Whispers)', startDate: '2026-06-15', endDate: '2027-06-14', status: 'Pending Signature', amount: '$22,000' },
    { id: 'CON-8790', client: 'Eleanor Vance', artwork: 'KV-SC-012 (Zen Garden I)', startDate: '2025-12-01', endDate: '2026-05-31', status: 'Completed', amount: '$18,000' },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-end mb-8 border-b border-gallery-gold/20 pb-4">
        <div>
          <h3 className="font-label-caps text-[10px] text-gallery-gold tracking-[0.3em] uppercase mb-2">LEGAL & COMPLIANCE</h3>
          <h4 className="font-display-md text-4xl tracking-tight text-primary">Contract Management</h4>
        </div>
        <button className="bg-primary text-white py-3 px-6 font-label-caps text-[11px] tracking-widest uppercase transition-all hover:bg-gallery-gold flex items-center justify-center gap-2 cursor-pointer shadow-sm">
          <span className="material-symbols-outlined text-[16px]">add</span>
          Draft New Lease
        </button>
      </div>

      <div className="bg-white border border-gallery-gold/20 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gallery-gold/10 bg-subtle-smoke/50">
          <div className="flex gap-4">
            <button className="font-label-caps text-[10px] tracking-widest uppercase text-primary border-b-2 border-primary pb-1">All Contracts</button>
            <button className="font-label-caps text-[10px] tracking-widest uppercase text-primary/40 hover:text-primary transition-colors pb-1">Active Leases</button>
            <button className="font-label-caps text-[10px] tracking-widest uppercase text-primary/40 hover:text-primary transition-colors pb-1">Pending Signatures</button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-primary/40">search</span>
            <input 
              type="text" 
              placeholder="Search ID or Client..." 
              className="pl-10 pr-4 py-2 bg-white border border-primary/20 font-body-md text-xs outline-none focus:border-gallery-gold transition-colors w-64"
            />
          </div>
        </div>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gallery-gold/10 bg-white">
              <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Contract ID / Asset</th>
              <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Client</th>
              <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Term Dates</th>
              <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase">Status & Value</th>
              <th className="p-6 font-label-caps text-[9px] tracking-widest text-primary/50 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gallery-gold/5">
            {mockContracts.map((contract) => (
              <tr key={contract.id} className="hover:bg-subtle-smoke transition-colors group">
                <td className="p-6">
                  <p className="font-display-md text-lg text-primary tracking-tight group-hover:text-gallery-gold transition-colors">{contract.id}</p>
                  <p className="font-label-caps text-[9px] tracking-widest text-primary/60 mt-1 uppercase">{contract.artwork}</p>
                </td>
                <td className="p-6">
                  <p className="font-body-md text-sm text-primary">{contract.client}</p>
                </td>
                <td className="p-6">
                  <p className="font-label-caps text-[10px] tracking-widest text-primary/80 uppercase">{contract.startDate}</p>
                  <p className="font-label-caps text-[9px] tracking-widest text-primary/40 mt-1 uppercase">UNTIL {contract.endDate}</p>
                </td>
                <td className="p-6">
                  <span className={`font-label-caps text-[9px] tracking-widest uppercase px-3 py-1 border ${
                    contract.status === 'Active Lease' ? 'bg-gallery-gold/10 border-gallery-gold/30 text-gallery-gold' :
                    contract.status === 'Completed' ? 'bg-primary/5 border-primary/20 text-primary/50' :
                    'bg-amber-500/10 border-amber-500/30 text-amber-600'
                  }`}>
                    {contract.status}
                  </span>
                  <p className="font-body-md text-xs text-primary/70 mt-2">{contract.amount}</p>
                </td>
                <td className="p-6 text-right">
                  <button className="text-primary/40 hover:text-primary transition-colors p-2" title="View Document">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </button>
                  <button className="text-primary/40 hover:text-gallery-gold transition-colors p-2" title="Edit Terms">
                    <span className="material-symbols-outlined text-[20px]">edit_document</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
