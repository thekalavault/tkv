import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import TopNavBar from '../../components/TopNavBar';
import Footer from '../../components/Footer';

// Define lead interface matching CRMManager
interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  companyName?: string;
  inquiryType: string;
  status: string;
  createdAt: string;
}

export default function SalesDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  // Stats
  const totalSales = "₹ 45,20,000";
  const mrr = "₹ 8,50,000";
  const activeLeads = leads.filter(l => l.status === 'new' || l.status === 'contacted').length || 12;

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch leads
    const fetchLeads = async () => {
      try {
        const token = localStorage.getItem('kalavault_token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3000/api/v1/crm/leads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setLeads(data);
        } else {
          console.error("Failed to fetch leads");
        }
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, []);

  return (
    <div className="bg-paper-white text-primary min-h-screen font-body-md flex flex-col pt-16 md:pt-24">
      <TopNavBar />

      <main className="flex-1 w-full max-w-[1800px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-5">
            <span className="font-label-caps text-[10px] text-gallery-gold uppercase tracking-[0.3em] block font-bold">
              Sales Intelligence
            </span>
            <div className="h-[1px] w-12 bg-gallery-gold/30" />
          </div>
          <h1 className="font-display-lg text-4xl md:text-6xl tracking-tight mb-4 text-primary leading-[1.1]">
            Global <span className="italic font-light text-gallery-gold font-serif">Sales</span>
          </h1>
          <p className="font-body-md text-on-surface-variant max-w-2xl text-lg">
            Monitor real-time acquisitions, pipeline health, and lead management.
          </p>
        </div>

        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-matte-black text-paper-white p-8 rounded-xl shadow-lg border border-outline/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gallery-gold/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="font-label-caps text-[11px] text-gallery-gold uppercase tracking-widest mb-4">Total Revenue YTD</p>
            <p className="font-display-lg text-4xl">{totalSales}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/5">
            <p className="font-label-caps text-[11px] text-primary/50 uppercase tracking-widest mb-4">Active MRR</p>
            <p className="font-display-lg text-4xl text-primary">{mrr}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/5">
            <p className="font-label-caps text-[11px] text-primary/50 uppercase tracking-widest mb-4">Active Pipeline</p>
            <p className="font-display-lg text-4xl text-primary">{activeLeads} <span className="text-xl font-body-md text-on-surface-variant font-normal">Leads</span></p>
          </div>
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-outline/5 p-8 mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-display-md text-2xl text-primary">Recent Leads & Inquiries</h2>
            <button className="font-label-caps text-[11px] uppercase tracking-widest bg-subtle-smoke px-6 py-3 hover:bg-gallery-gold hover:text-white transition-colors">
              Export CSV
            </button>
          </div>
          
          {loading ? (
            <div className="py-20 text-center font-label-caps text-sm text-primary/50 animate-pulse">Loading Pipeline Data...</div>
          ) : leads.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-outline/20 bg-subtle-smoke/30 rounded-lg">
              <p className="font-body-md text-on-surface-variant">No leads found in the system yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-outline/10 text-primary/60 font-label-caps text-[10px] uppercase tracking-widest">
                    <th className="pb-4 font-normal">Client</th>
                    <th className="pb-4 font-normal">Company</th>
                    <th className="pb-4 font-normal">Contact</th>
                    <th className="pb-4 font-normal">Type</th>
                    <th className="pb-4 font-normal">Status</th>
                    <th className="pb-4 font-normal text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="font-body-md text-sm">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="border-b border-outline/5 hover:bg-subtle-smoke/50 transition-colors">
                      <td className="py-4 text-primary font-medium">{lead.name}</td>
                      <td className="py-4 text-on-surface-variant">{lead.companyName || '-'}</td>
                      <td className="py-4 text-on-surface-variant">{lead.email}</td>
                      <td className="py-4"><span className="px-3 py-1 bg-subtle-smoke rounded-full text-xs capitalize">{lead.inquiryType.replace('_', ' ')}</span></td>
                      <td className="py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-label-caps uppercase tracking-wider ${
                          lead.status === 'new' ? 'bg-gallery-gold/10 text-gallery-gold' : 'bg-green-100 text-green-700'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 text-right text-on-surface-variant text-xs">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
