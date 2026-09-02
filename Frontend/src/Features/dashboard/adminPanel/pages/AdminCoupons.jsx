import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { GlassCard } from '../Shared/GlassCard';
import { Search, PlusCircle, Edit2, Trash2, CheckCircle2, XCircle, Sparkles, Loader2 } from 'lucide-react';
import API from '../../../auth/services/api';

const emptyForm = {
  code: '',
  name: '',
  description: '',
  discountType: 'percent',
  discountValue: '',
  maxDiscount: '',
  minAmount: '',
  applicableTo: 'all',
  selectedCourses: [],
  selectedBootcamps: [],
  categories: [],
  usageLimit: '',
  perUserLimit: '1',
  startsAt: '',
  expiresAt: '',
  active: true,
  isPublic: true,
  firstTimeUserOnly: false,
  stackable: false,
  adminNotes: '',
};

const AdminCoupons = () => {
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState('');

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/coupon/admin');
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  useEffect(() => {
    const value = Number(form.discountValue || 0);
    if (form.discountType === 'percent') {
      setPreview(`${value}% off`);
    } else {
      setPreview(`₹${value} fixed`);
    }
  }, [form.discountType, form.discountValue]);

  const filtered = useMemo(() => {
    return coupons.filter((item) => [item.code, item.name, item.description].join(' ').toLowerCase().includes(search.toLowerCase()));
  }, [coupons, search]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({ ...prev, [name]: checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        discountValue: Number(form.discountValue || 0),
        maxDiscount: Number(form.maxDiscount || 0),
        minAmount: Number(form.minAmount || 0),
        usageLimit: Number(form.usageLimit || 0),
        perUserLimit: Number(form.perUserLimit || 1),
      };
      if (editingId) {
        await API.put(`/coupon/${editingId}`, payload);
        toast.success('Coupon updated');
      } else {
        await API.post('/coupon/create', payload);
        toast.success('Coupon created');
      }
      resetForm();
      fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to save coupon');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coupon) => {
    setEditingId(coupon._id);
    setForm({
      ...emptyForm,
      ...coupon,
      discountValue: coupon.discountValue || '',
      maxDiscount: coupon.maxDiscount || '',
      minAmount: coupon.minAmount || '',
      usageLimit: coupon.usageLimit || '',
      perUserLimit: coupon.perUserLimit || '1',
      startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 10) : '',
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
      selectedCourses: coupon.selectedCourses || [],
      selectedBootcamps: coupon.selectedBootcamps || [],
      categories: coupon.categories || [],
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`/coupon/${id}`);
      toast.success('Coupon deleted');
      fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Delete failed');
    }
  };

  const toggleStatus = async (id) => {
    try {
      await API.patch(`/coupon/${id}/toggle`);
      toast.success('Coupon status updated');
      fetchCoupons();
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Update failed');
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold italic">Coupon Management</h1>
          <p className="text-text-secondary text-sm">Create and manage discounts with validation, preview, and expiration controls.</p>
        </div>
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 px-5 py-3 rounded-full bg-accent text-bg font-bold">Back to Dashboard</button>
      </div>

      <GlassCard className="p-6 space-y-6">
        <div className="flex items-center gap-2 text-accent"><Sparkles size={18}/> Create / Edit Coupon</div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Coupon Name"><input name="name" value={form.name} onChange={handleChange} className="input" /></Field>
            <Field label="Coupon Code"><input name="code" value={form.code} onChange={handleChange} className="input uppercase" /></Field>
            <Field label="Description" className="md:col-span-2"><textarea rows={2} name="description" value={form.description} onChange={handleChange} className="input" /></Field>
            <Field label="Discount Type"><select name="discountType" value={form.discountType} onChange={handleChange} className="input"><option value="percent">Percentage</option><option value="fixed">Fixed Amount</option></select></Field>
            <Field label="Discount Value"><input type="number" name="discountValue" value={form.discountValue} onChange={handleChange} className="input" /></Field>
            <Field label="Maximum Discount"><input type="number" name="maxDiscount" value={form.maxDiscount} onChange={handleChange} className="input" /></Field>
            <Field label="Minimum Purchase"><input type="number" name="minAmount" value={form.minAmount} onChange={handleChange} className="input" /></Field>
            <Field label="Applicability"><select name="applicableTo" value={form.applicableTo} onChange={handleChange} className="input"><option value="all">All Courses</option><option value="courses">Selected Courses</option><option value="bootcamps">Bootcamps</option><option value="categories">Categories</option></select></Field>
            <Field label="Usage Limit"><input type="number" name="usageLimit" value={form.usageLimit} onChange={handleChange} className="input" /></Field>
            <Field label="Per User Limit"><input type="number" name="perUserLimit" value={form.perUserLimit} onChange={handleChange} className="input" /></Field>
            <Field label="Start Date"><input type="date" name="startsAt" value={form.startsAt} onChange={handleChange} className="input" /></Field>
            <Field label="Expiry Date"><input type="date" name="expiresAt" value={form.expiresAt} onChange={handleChange} className="input" /></Field>
            <Field label="Status"><select name="active" value={form.active ? 'active' : 'inactive'} onChange={(e) => setForm((prev) => ({ ...prev, active: e.target.value === 'active' }))} className="input"><option value="active">Active</option><option value="inactive">Inactive</option></select></Field>
            <Field label="Visibility"><select name="isPublic" value={form.isPublic ? 'public' : 'private'} onChange={(e) => setForm((prev) => ({ ...prev, isPublic: e.target.value === 'public' }))} className="input"><option value="public">Public</option><option value="private">Private</option></select></Field>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Live Discount Preview</h3>
              <span className="rounded-full border border-accent/20 bg-accent/10 px-3 py-1 text-[10px] uppercase tracking-widest text-accent">{preview}</span>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="firstTimeUserOnly" checked={form.firstTimeUserOnly} onChange={handleChange} /> First time user only</label>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="stackable" checked={form.stackable} onChange={handleChange} /> Stackable</label>
            </div>
          </div>

          <Field label="Admin Notes"><textarea rows={3} name="adminNotes" value={form.adminNotes} onChange={handleChange} className="input" /></Field>

          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent text-bg font-bold">{saving ? <Loader2 className="animate-spin" size={16}/> : <PlusCircle size={16}/>} {editingId ? 'Update Coupon' : 'Create Coupon'}</button>
            <button type="button" onClick={resetForm} className="px-6 py-3 rounded-full bg-white/5 border border-white/10">Reset</button>
          </div>
        </form>
      </GlassCard>

      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
          <div>
            <h3 className="text-xl font-semibold">Active Coupons</h3>
            <p className="text-text-secondary text-sm">Search, edit, enable, disable, or remove offers.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search coupons" className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-3" />
          </div>
        </div>

        {loading ? <div className="py-10 text-center text-text-secondary">Loading coupons...</div> : filtered.length === 0 ? <div className="py-10 text-center text-text-secondary">No coupons found.</div> : <div className="overflow-x-auto"><table className="w-full border-collapse text-sm"><thead><tr className="text-left text-text-secondary"><th className="py-3">Code</th><th className="py-3">Name</th><th className="py-3">Value</th><th className="py-3">Usage</th><th className="py-3">Expiry</th><th className="py-3">Status</th><th className="py-3 text-right">Actions</th></tr></thead><tbody>{filtered.map((coupon) => <tr key={coupon._id} className="border-t border-white/10"><td className="py-3 font-semibold">{coupon.code}</td><td className="py-3">{coupon.name}</td><td className="py-3">{coupon.discountType === 'percent' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td><td className="py-3">{coupon.usageCount || 0}/{coupon.usageLimit || '∞'}</td><td className="py-3">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'No expiry'}</td><td className="py-3">{coupon.active ? <span className="text-emerald-400">Active</span> : <span className="text-red-400">Inactive</span>}</td><td className="py-3 text-right"><div className="flex justify-end gap-2"><button onClick={() => handleEdit(coupon)} className="p-2 rounded-lg hover:bg-white/10"><Edit2 size={16}/></button><button onClick={() => toggleStatus(coupon._id)} className="p-2 rounded-lg hover:bg-white/10">{coupon.active ? <XCircle size={16}/> : <CheckCircle2 size={16}/>}</button><button onClick={() => handleDelete(coupon._id)} className="p-2 rounded-lg hover:bg-red-500/20 text-red-400"><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
      </GlassCard>
    </div>
  );
};

const Field = ({ label, children, className = '' }) => (
  <label className={`space-y-2 ${className}`}>
    <span className="text-[10px] uppercase tracking-widest text-text-secondary">{label}</span>
    {children}
  </label>
);

export default AdminCoupons;
