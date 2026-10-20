import React, { useState, useEffect } from 'react';
import { Order, OrderStatus, OrderSubstatus } from '../../types';
import { X, Phone, MapPin, CheckCircle, Truck, Package, MessageSquare, Printer, Save } from 'lucide-react';

interface OrderDetailsDrawerProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateOrder: (updatedOrder: Order) => void;
  onOpenChatWithBuyer?: (buyerName: string) => void;
}

export const OrderDetailsDrawer: React.FC<OrderDetailsDrawerProps> = ({
  order,
  isOpen,
  onClose,
  onUpdateOrder,
  onOpenChatWithBuyer,
}) => {
  const [status, setStatus] = useState<OrderStatus>('In progress');
  const [substatus, setSubstatus] = useState<OrderSubstatus>('Needs city');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [deliveryFee, setDeliveryFee] = useState(35);
  const [sellerNotes, setSellerNotes] = useState('');

  useEffect(() => {
    if (order) {
      setStatus(order.status);
      setSubstatus(order.substatus);
      setCity(order.deliveryCity === 'Not provided' ? '' : order.deliveryCity);
      setPhone(order.buyerPhone || '');
      setAddress(order.buyerAddress || '');
      setQuantity(order.quantity);
      setDeliveryFee(order.deliveryFee);
      setSellerNotes(order.sellerNotes || '');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const totalCalculated = order.articlePrice * quantity + deliveryFee;

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const lower = newCity.toLowerCase();
    if (lower.includes('casa') || lower.includes('البيضاء')) {
      setDeliveryFee(20);
    } else {
      setDeliveryFee(35);
    }
  };

  const handleSave = () => {
    const updated: Order = {
      ...order,
      status,
      substatus,
      deliveryCity: city.trim() || 'Not provided',
      buyerPhone: phone.trim() || undefined,
      buyerAddress: address.trim() || undefined,
      quantity,
      deliveryFee,
      totalAmount: totalCalculated,
      sellerNotes: sellerNotes.trim() || undefined,
    };
    onUpdateOrder(updated);
    onClose();
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const whatsappNumber = phone ? phone.replace(/\D/g, '').replace(/^0/, '212') : '';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-blue-400">{order.orderNumber}</span>
              <span className="text-slate-600">·</span>
              <span className="text-xs text-slate-400">{order.createdAt}</span>
            </div>
            <h2 className="text-lg font-bold text-white mt-0.5">{order.buyerName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* Status & Substatus Section */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Order Fulfillment Pipeline
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Lifecycle Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as OrderStatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="In progress">In progress</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Attention Requirement</label>
                <select
                  value={substatus}
                  onChange={(e) => setSubstatus(e.target.value as OrderSubstatus)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-amber-300 font-medium focus:outline-none focus:border-blue-500"
                >
                  <option value="Needs city">Needs city</option>
                  <option value="Needs phone number">Needs phone number</option>
                  <option value="Needs buyer confirmation">Needs buyer confirmation</option>
                  <option value="Needs quantity">Needs quantity</option>
                  <option value="Needs location">Needs location</option>
                  <option value="Ready to ship">Ready to ship</option>
                  <option value="Complete">Complete</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 text-slate-400 text-[11px]">
              <span>Assigned Account:</span>
              <span className="font-mono text-blue-400 font-medium">{order.facebookAccount}</span>
            </div>
          </div>

          {/* Customer & Delivery Coordinates */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Customer & Delivery Information
              </span>
              {whatsappNumber && (
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Open WhatsApp</span>
                </a>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Phone Number (Morocco)</label>
                <input
                  type="text"
                  placeholder="06 XX XX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Destination City</label>
                <input
                  type="text"
                  placeholder="Casablanca, Rabat, Tanger..."
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Exact Delivery Address / Neighborhood</label>
              <input
                type="text"
                placeholder="Quartier, Rue, N°, Repère..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Ordered Item & Financial Math */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Item Details & Cash On Delivery
            </span>

            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
              <div className="font-medium text-slate-200">{order.articleTitle}</div>
              <div className="flex items-center justify-between text-slate-400 mt-2 font-mono">
                <span>Unit Price</span>
                <span className="text-white">{order.articlePrice} dhs</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Delivery Fee (MAD)</label>
                <input
                  type="number"
                  value={deliveryFee}
                  onChange={(e) => setDeliveryFee(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Total Math summary */}
            <div className="pt-3 border-t border-slate-800 space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal ({quantity} item)</span>
                <span>{order.articlePrice * quantity} dhs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery (COD)</span>
                <span>+{deliveryFee} dhs</span>
              </div>
              <div className="flex justify-between text-white font-bold text-sm pt-1 border-t border-slate-800">
                <span>Total to Collect (MAD)</span>
                <span className="text-emerald-400">{totalCalculated} dhs</span>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-slate-400 mb-1">Internal Courier / Seller Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Call buyer before 12 PM, prefers delivery in evening..."
              value={sellerNotes}
              onChange={(e) => setSellerNotes(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSlip}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print Slip</span>
            </button>
            {onOpenChatWithBuyer && (
              <button
                onClick={() => {
                  onClose();
                  onOpenChatWithBuyer(order.buyerName);
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Open Chat</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Order</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
