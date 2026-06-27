import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import TopNavBar from '../components/TopNavBar';

export default function Cart() {
  const { items: cartItems, total: cartTotal, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="bg-paper-white text-primary min-h-screen flex flex-col font-body-md overflow-x-hidden selection:bg-gallery-gold/30">
      <TopNavBar />
      <main className="flex-1 mt-24 max-w-[1600px] w-full mx-auto px-6 md:px-12 py-16">
        <div>
          <section className="space-y-2 mb-10 border-b border-gallery-gold/20 pb-4">
            <span className="font-label-caps text-[10px] tracking-widest text-gallery-gold uppercase block">CHECKOUT</span>
            <h3 className="font-display-md text-4xl tracking-tight text-primary">Your Cart</h3>
          </section>
          {cartItems.length === 0 ? (
            <div className="bg-subtle-smoke p-12 border border-gallery-gold/20 text-center">
              <p className="font-body-md text-primary/60 mb-6">Your cart is currently empty.</p>
              <Link to="/customer?tab=catalog" className="px-8 py-3 bg-primary text-white font-label-caps text-[11px] tracking-widest uppercase hover:bg-gallery-gold transition-colors inline-block">
                Browse Artwork
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="md:col-span-2 bg-subtle-smoke border border-gallery-gold/20 p-0 overflow-hidden shadow-sm h-max">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gallery-gold/20 text-left bg-white">
                      <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase">Artwork Details</th>
                      <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase">Price</th>
                      <th className="p-6 font-label-caps text-[10px] tracking-widest text-primary/60 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gallery-gold/10">
                    {cartItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white transition-all group">
                        <td className="p-6 w-full md:w-auto">
                          <div className="flex items-center gap-6">
                            {item.imageUrl && (
                              <div className="w-20 h-20 bg-white overflow-hidden group-hover:ring-1 group-hover:ring-gallery-gold/30 transition-all border border-gallery-gold/10 shrink-0">
                                <img 
                                  src={item.imageUrl.startsWith('http') || item.imageUrl.startsWith('/') ? item.imageUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/uploads/${item.imageUrl}`} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                />
                              </div>
                            )}
                            <div>
                              <p className="font-display-md text-xl leading-tight mb-1 group-hover:text-gallery-gold transition-colors tracking-tight">{item.name}</p>
                              <p className="font-label-caps text-[10px] tracking-widest text-primary/50 uppercase">Type: {item.type.replace('_', ' ')}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-6 align-middle hidden md:table-cell">
                          <p className="font-display-md text-lg text-primary">₹{item.price.toLocaleString('en-IN')}</p>
                        </td>
                        <td className="p-6 text-right align-middle">
                          <button onClick={() => removeFromCart(item.id)} className="text-primary/50 hover:text-red-500 transition-colors cursor-pointer p-2 rounded-full hover:bg-red-500/10" title="Remove from Cart">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-subtle-smoke p-8 border border-gallery-gold/20 h-max">
                <h4 className="font-display-md text-2xl mb-6 border-b border-outline/10 pb-4">Order Summary</h4>
                <div className="flex justify-between items-center mb-4">
                  <span className="font-body-md text-primary/70">Subtotal</span>
                  <span className="font-body-md text-primary font-bold">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline/10">
                  <span className="font-body-md text-primary/70">Taxes & Fees</span>
                  <span className="font-body-md text-primary/70">Calculated at checkout</span>
                </div>
                <div className="flex justify-between items-end mb-8">
                  <span className="font-label-caps text-[11px] tracking-widest">Total</span>
                  <span className="font-display-md text-3xl text-primary">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <button 
                  onClick={() => {
                    alert('Redirecting to Razorpay checkout...');
                    window.open('https://razorpay.com', '_blank');
                    clearCart();
                  }}
                  className="w-full bg-gallery-gold text-primary font-bold font-label-caps text-[11px] tracking-widest uppercase px-6 py-4 hover:bg-primary hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                  Acquire Now
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="w-full px-12 py-12 flex flex-col items-center justify-center bg-paper-white border-t border-gallery-gold/20 mt-auto">
        <p className="font-label-caps text-[9px] tracking-widest uppercase text-primary/40">© 2026 The Kala Vault. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
