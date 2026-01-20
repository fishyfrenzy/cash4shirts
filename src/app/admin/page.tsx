"use client";

import { useState, useEffect } from "react";
import {
  Eye,
  Phone,
  MapPin,
  Clock,
  Filter,
  RefreshCw,
  Lock,
  X,
  ChevronDown,
  Trophy,
  Plus,
  Trash2,
  Upload,
  Camera,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStatus, RecentBuy, RecentBuyInsert } from "@/types";
import { formatPhoneNumber, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { verifyAdminPassword } from "./actions";

const statusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  purchased: "bg-green-100 text-green-800",
  lost: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  purchased: "Purchased",
  lost: "Lost",
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"leads" | "recent-buys">("leads");

  // Leads State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Recent Buys State
  const [recentBuys, setRecentBuys] = useState<RecentBuy[]>([]);
  const [hallOfFameLoading, setHallOfFameLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [newBuy, setNewBuy] = useState<RecentBuyInsert>({
    item_name: "",
    description: "",
    price_paid: 0,
    image_url: "",
    technical_details: {
      tag: "",
      stitch: "",
      era: "",
      condition: "",
    },
  });

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated or tab changes
  useEffect(() => {
    if (isAuthenticated) {
      if (activeTab === "leads") {
        fetchLeads();
      } else {
        fetchRecentBuys();
      }
    }
  }, [isAuthenticated, activeTab, filterStatus, filterLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const isValid = await verifyAdminPassword(password);

      if (isValid) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
      } else {
        setAuthError("Incorrect password");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("An error occurred during authentication");
    }
  };

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      let query = supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (filterLocation !== "all") {
        query = query.eq("location", filterLocation);
      }

      const { data, error } = await query;
      if (!error) setLeads(data || []);
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentBuys = async () => {
    setHallOfFameLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("recent_buys")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setRecentBuys(data || []);
    } catch (err) {
      console.error("Error fetching hall of fame:", err);
    } finally {
      setHallOfFameLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const supabase = createClient();
      const fileExt = file.name.split(".").pop();
      const fileName = `recent-buys/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("shirt-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("shirt-images")
        .getPublicUrl(fileName);

      setNewBuy(prev => ({ ...prev, image_url: publicUrl }));
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
    }
  };

  const addRecentBuy = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("recent_buys")
        .insert([newBuy]);

      if (error) throw error;

      setShowAddModal(false);
      setNewBuy({
        item_name: "",
        description: "",
        price_paid: 0,
        image_url: "",
        technical_details: { tag: "", stitch: "", era: "", condition: "" },
      });
      fetchRecentBuys();
    } catch (err) {
      console.error("Error adding hall of fame item:", err);
      alert("Failed to add item");
    }
  };

  const deleteRecentBuy = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("recent_buys")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchRecentBuys();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingStatus(leadId);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (!error) {
        setLeads((prev: Lead[]) => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
        if (selectedLead?.id === leadId) setSelectedLead((prev: Lead | null) => prev ? { ...prev, status: newStatus } : null);
      }
    } catch (err) {
      console.error("Error updating status:", err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const updateLeadNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("leads")
        .update({ admin_notes: adminNotes })
        .eq("id", selectedLead.id);

      if (!error) {
        setLeads((prev: Lead[]) => prev.map(l => l.id === selectedLead.id ? { ...l, admin_notes: adminNotes } : l));
        setSelectedLead((prev: Lead | null) => prev ? { ...prev, admin_notes: adminNotes } : null);
      }
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  useEffect(() => {
    if (selectedLead) setAdminNotes(selectedLead.admin_notes || "");
  }, [selectedLead?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-navy/10 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} className="text-navy" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy">Admin Dashboard</h1>
            <p className="text-navy/60 mt-2">Enter password to access dashboard</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-money outline-none"
              autoFocus
            />
            {authError && <p className="text-red-600 text-center">{authError}</p>}
            <Button type="submit" className="w-full">Access Dashboard</Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-serif font-bold">
              Cash<span className="text-money-light">4</span>Shirts Admin
            </h1>
            <nav className="hidden md:flex items-center gap-1">
              <button
                onClick={() => setActiveTab("leads")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "leads" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
              >
                Leads
              </button>
              <button
                onClick={() => setActiveTab("recent-buys")}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "recent-buys" ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}
              >
                Recent Buys
              </button>
            </nav>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("admin_auth"); setIsAuthenticated(false); }}
            className="text-white/70 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {activeTab === "leads" ? (
          <>
            {/* Leads Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
              <Filter size={20} className="text-navy/50" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "all")}
                className="px-4 py-2 border border-gray-200 rounded-lg text-navy outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="purchased">Purchased</option>
                <option value="lost">Lost</option>
              </select>
              <select
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-navy outline-none"
              >
                <option value="all">All Locations</option>
                <option value="indianapolis">Indiana</option>
                <option value="florida">Florida</option>
              </select>
              <button onClick={fetchLeads} className="ml-auto flex items-center gap-2 px-4 py-2 text-navy hover:bg-gray-100 rounded-lg">
                <RefreshCw size={18} /> Refresh
              </button>
            </div>

            {/* Leads Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 border-4 border-money border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-navy/60">Loading leads...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="p-12 text-center"><p className="text-navy/60 text-lg">No leads found</p></div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Location</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Date</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {leads.map((lead: Lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-navy">{lead.full_name}</p>
                            <p className="text-sm text-navy/60">{lead.images.length} photo{lead.images.length !== 1 ? "s" : ""}</p>
                          </td>
                          <td className="px-6 py-4">
                            <a href={`tel:${lead.phone_number}`} className="flex items-center gap-2 text-navy hover:text-money">
                              <Phone size={16} /> {formatPhoneNumber(lead.phone_number)}
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            <span className="flex items-center gap-2 text-navy">
                              <MapPin size={16} className="text-navy/50" /> {lead.location}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative">
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                disabled={updatingStatus === lead.id}
                                className={`appearance-none px-3 py-1 pr-8 rounded-full text-sm font-medium ${statusColors[lead.status as LeadStatus]}`}
                              >
                                {Object.keys(statusLabels).map((status) => (
                                  <option key={status} value={status}>{statusLabels[status as LeadStatus]}</option>
                                ))}
                              </select>
                              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2" />
                            </div>
                          </td>
                          <td className="px-6 py-4"><span className="flex items-center gap-2 text-navy/60 text-sm"><Clock size={14} /> {formatDate(lead.created_at)}</span></td>
                          <td className="px-6 py-4">
                            <button onClick={() => setSelectedLead(lead)} className="flex items-center gap-2 px-3 py-2 text-sm text-navy hover:bg-navy/5 rounded-lg">
                              <Eye size={16} /> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Recent Buys View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-serif font-bold text-navy flex items-center gap-2">
                <Trophy className="text-money" /> Recent Buys Management
              </h2>
              <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
                <Plus size={20} /> Add New Buy
              </Button>
            </div>

            {hallOfFameLoading ? (
              <div className="p-12 text-center"><div className="w-8 h-8 border-4 border-money border-t-transparent rounded-full animate-spin mx-auto mb-4" /><p>Loading Recent Buys...</p></div>
            ) : recentBuys.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border-2 border-dashed border-gray-200">
                <Trophy size={48} className="text-gray-200 mx-auto mb-4" />
                <p className="text-navy/60 text-lg">Your Recent Buys is empty. Add your first big purchase!</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentBuys.map((buy: RecentBuy) => (
                  <div key={buy.id} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                    <div className="aspect-square relative">
                      <img src={buy.image_url} alt={buy.item_name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <button
                          onClick={() => deleteRecentBuy(buy.id)}
                          className="p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-white font-bold text-xl">${buy.price_paid} PAID</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-navy text-lg mb-1">{buy.item_name}</h3>
                      <p className="text-navy/60 text-sm mb-3">{buy.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries((buy.technical_details || {}) as Record<string, string>).map(([key, val]) => val && (
                          <span key={key} className="px-2 py-0.5 bg-navy/5 text-navy/70 text-xs rounded-full border border-navy/10">
                            {val}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Recent Buys Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-serif font-bold text-navy mb-6">Add Recent Buy</h2>
            <form onSubmit={addRecentBuy} className="space-y-6">
              <div
                onClick={() => document.getElementById("recent-buys-img")?.click()}
                className="aspect-video border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"
              >
                {newBuy.image_url ? (
                  <img src={newBuy.image_url} className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center">
                    {uploadingImage ? <RefreshCw className="animate-spin text-money mx-auto" size={32} /> : <Camera className="text-gray-300 mx-auto" size={48} />}
                    <p className="text-navy/50 mt-2">Click to upload shirt photo</p>
                  </div>
                )}
                <input type="file" id="recent-buys-img" hidden onChange={handleImageUpload} accept="image/*" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-bold text-navy mb-1 uppercase tracking-wider text-[10px]">Item Name</label>
                  <input
                    required
                    value={newBuy.item_name}
                    onChange={e => setNewBuy(prev => ({ ...prev, item_name: e.target.value }))}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-money"
                    placeholder="e.g. 1980s Harley 3D Emblem"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1 uppercase tracking-wider text-[10px]">Price Paid ($)</label>
                  <input
                    type="number"
                    required
                    value={newBuy.price_paid}
                    onChange={e => setNewBuy(prev => ({ ...prev, price_paid: Number(e.target.value) }))}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-money"
                    placeholder="450"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1 uppercase tracking-wider text-[10px]">Era</label>
                  <input
                    value={newBuy.technical_details.era}
                    onChange={e => setNewBuy(prev => ({ ...prev, technical_details: { ...prev.technical_details, era: e.target.value } }))}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-money"
                    placeholder="1980s"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1 uppercase tracking-wider text-[10px]">Tag</label>
                  <input
                    value={newBuy.technical_details.tag}
                    onChange={e => setNewBuy(prev => ({ ...prev, technical_details: { ...prev.technical_details, tag: e.target.value } }))}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-money"
                    placeholder="Screen Stars Blue Bar"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-navy mb-1 uppercase tracking-wider text-[10px]">Stitching</label>
                  <input
                    value={newBuy.technical_details.stitch}
                    onChange={e => setNewBuy(prev => ({ ...prev, technical_details: { ...prev.technical_details, stitch: e.target.value } }))}
                    className="w-full p-3 bg-gray-50 border-2 border-gray-100 rounded-lg outline-none focus:border-money"
                    placeholder="Single-Stitch"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-gray-100 text-navy hover:bg-gray-200">Cancel</Button>
                <Button type="submit" disabled={!newBuy.image_url} className="flex-1">Save Recent Buys Entry</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Leads Detail Modal (Existing) */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLead(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-navy">Lead Details</h2>
              <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
            </div>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div><h3 className="font-bold text-navy mb-2">Contact Info</h3><div className="space-y-1"><p><strong>Name:</strong> {selectedLead.full_name}</p><p><strong>Phone:</strong> {formatPhoneNumber(selectedLead.phone_number)}</p><p><strong>Location:</strong> {selectedLead.location}</p></div></div>
                <div><h3 className="font-bold text-navy mb-2">Quiz Results</h3><div className="space-y-1"><p><strong>Type:</strong> {selectedLead.quiz_responses.shirtType}</p><p><strong>Decades:</strong> {selectedLead.quiz_responses.decades.join(", ")}</p><p><strong>Condition:</strong> {selectedLead.quiz_responses.condition}</p></div></div>
              </div>
              {selectedLead.user_comments && (<div><h3 className="font-bold text-navy mb-2">User Comments</h3><p className="bg-gray-50 p-3 rounded-lg italic">"{selectedLead.user_comments}"</p></div>)}
              <div><h3 className="font-bold text-navy mb-4">Photos</h3><div className="grid grid-cols-3 gap-2">{selectedLead.images.map((u, i) => (<a key={i} href={u} target="_blank" className="aspect-square bg-gray-100 rounded overflow-hidden"><img src={u} className="w-full h-full object-cover" /></a>))}</div></div>
              <div className="pt-4 border-t border-gray-100">
                <h3 className="font-bold text-navy mb-2">Admin Notes</h3>
                <textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} className="w-full p-3 border rounded-lg h-24 mb-3" placeholder="Add internal notes..." />
                <Button onClick={updateLeadNotes} isLoading={savingNotes} disabled={adminNotes === (selectedLead.admin_notes || "")} className="w-full">Save Notes</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
