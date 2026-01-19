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
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Lead, LeadStatus } from "@/types";
import { formatPhoneNumber, formatDate } from "@/lib/utils";
import Button from "@/components/ui/Button";

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "all">("all");
  const [filterLocation, setFilterLocation] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  // Check if already authenticated (session storage)
  useEffect(() => {
    const auth = sessionStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch leads when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchLeads();
    }
  }, [isAuthenticated, filterStatus, filterLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    // Simple password check (in production, use proper auth)
    // The password is checked against an environment variable
    const correctPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "cash4shirts2024";

    if (password === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_auth", "true");
    } else {
      setAuthError("Incorrect password");
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

      if (error) {
        console.error("Fetch error:", error);
      } else {
        setLeads(data || []);
      }
    } catch (err) {
      console.error("Error fetching leads:", err);
    } finally {
      setLoading(false);
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

      if (error) {
        console.error("Update error:", error);
      } else {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === leadId ? { ...lead, status: newStatus } : lead
          )
        );
        if (selectedLead?.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
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

      if (error) {
        console.error("Update notes error:", error);
      } else {
        setLeads((prev) =>
          prev.map((lead) =>
            lead.id === selectedLead.id ? { ...lead, admin_notes: adminNotes } : lead
          )
        );
        setSelectedLead((prev) => (prev ? { ...prev, admin_notes: adminNotes } : null));
      }
    } catch (err) {
      console.error("Error updating notes:", err);
    } finally {
      setSavingNotes(false);
    }
  };

  useEffect(() => {
    if (selectedLead) {
      setAdminNotes(selectedLead.admin_notes || "");
    }
  }, [selectedLead?.id]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-navy/10 rounded-full flex items-center justify-center mb-4">
              <Lock size={32} className="text-navy" />
            </div>
            <h1 className="text-2xl font-serif font-bold text-navy">
              Admin Dashboard
            </h1>
            <p className="text-navy/60 mt-2">
              Enter password to access leads
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-lg focus:border-money focus:ring-2 focus:ring-money/20 outline-none"
                autoFocus
              />
            </div>

            {authError && (
              <p className="text-red-600 text-center">{authError}</p>
            )}

            <Button type="submit" className="w-full">
              Access Dashboard
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy text-white py-4 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-serif font-bold">
            Cash<span className="text-money-light">4</span>Shirts Admin
          </h1>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_auth");
              setIsAuthenticated(false);
            }}
            className="text-white/70 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6 flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={20} className="text-navy/50" />
            <span className="font-medium text-navy">Filters:</span>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as LeadStatus | "all")}
            className="px-4 py-2 border border-gray-200 rounded-lg text-navy focus:border-money focus:ring-2 focus:ring-money/20 outline-none"
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
            className="px-4 py-2 border border-gray-200 rounded-lg text-navy focus:border-money focus:ring-2 focus:ring-money/20 outline-none"
          >
            <option value="all">All Locations</option>
            <option value="indianapolis">Indiana</option>
            <option value="florida">Florida</option>
          </select>

          <button
            onClick={fetchLeads}
            className="ml-auto flex items-center gap-2 px-4 py-2 text-navy hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {(["new", "contacted", "purchased", "lost"] as LeadStatus[]).map((status) => (
            <div key={status} className="bg-white rounded-xl shadow-sm p-4">
              <p className="text-sm text-navy/60 uppercase tracking-wide">
                {statusLabels[status]}
              </p>
              <p className="text-3xl font-bold text-navy">
                {leads.filter((l) => l.status === status).length}
              </p>
            </div>
          ))}
        </div>

        {/* Leads Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-money border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-navy/60">Loading leads...</p>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-navy/60 text-lg">No leads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-navy uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-navy">{lead.full_name}</p>
                        <p className="text-sm text-navy/60">
                          {lead.images.length} photo{lead.images.length !== 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <a
                          href={`tel:${lead.phone_number}`}
                          className="flex items-center gap-2 text-navy hover:text-money"
                        >
                          <Phone size={16} />
                          {formatPhoneNumber(lead.phone_number)}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-navy">
                          <MapPin size={16} className="text-navy/50" />
                          {lead.location === "indianapolis"
                            ? "Indiana"
                            : lead.location === "florida"
                              ? "Florida"
                              : lead.location}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="relative">
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              updateLeadStatus(lead.id, e.target.value as LeadStatus)
                            }
                            disabled={updatingStatus === lead.id}
                            className={`appearance-none px-3 py-1 pr-8 rounded-full text-sm font-medium cursor-pointer ${statusColors[lead.status]}`}
                          >
                            {(Object.keys(statusLabels) as LeadStatus[]).map((status) => (
                              <option key={status} value={status}>
                                {statusLabels[status]}
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-2 text-navy/60 text-sm">
                          <Clock size={14} />
                          {formatDate(lead.created_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-navy hover:bg-navy/5 rounded-lg transition-colors"
                        >
                          <Eye size={16} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelectedLead(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-navy">Lead Details</h2>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Contact Info */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">
                  Contact Information
                </h3>
                <div className="space-y-2">
                  <p className="text-lg">
                    <strong>Name:</strong> {selectedLead.full_name}
                  </p>
                  <p className="text-lg">
                    <strong>Phone:</strong>{" "}
                    <a
                      href={`tel:${selectedLead.phone_number}`}
                      className="text-money hover:underline"
                    >
                      {formatPhoneNumber(selectedLead.phone_number)}
                    </a>
                  </p>
                  <p className="text-lg">
                    <strong>Location:</strong>{" "}
                    {selectedLead.location === "indianapolis"
                      ? "Indiana"
                      : selectedLead.location === "florida"
                        ? "Florida"
                        : selectedLead.location}
                  </p>
                  <p className="text-lg">
                    <strong>Submitted:</strong> {formatDate(selectedLead.created_at)}
                  </p>
                </div>
              </div>

              {/* Quiz Responses */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">
                  Quiz Responses
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p>
                    <strong>Shirt Type:</strong>{" "}
                    {selectedLead.quiz_responses.shirtType}
                  </p>
                  <p>
                    <strong>Decade(s):</strong>{" "}
                    {Array.isArray(selectedLead.quiz_responses.decades)
                      ? selectedLead.quiz_responses.decades.join(", ")
                      : selectedLead.quiz_responses.decades}
                  </p>
                  <p>
                    <strong>Volume:</strong> {selectedLead.quiz_responses.volume}
                  </p>
                  <p>
                    <strong>Condition:</strong>{" "}
                    {selectedLead.quiz_responses.condition}
                  </p>
                </div>
              </div>

              {/* User Comments */}
              {selectedLead.user_comments && (
                <div>
                  <h3 className="text-lg font-semibold text-navy mb-3">
                    Additional Details from User
                  </h3>
                  <div className="bg-money/5 border border-money/20 rounded-lg p-4 text-navy italic">
                    &quot;{selectedLead.user_comments}&quot;
                  </div>
                </div>
              )}

              {/* Images */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">
                  Uploaded Photos ({selectedLead.images.length})
                </h3>
                {selectedLead.images.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {selectedLead.images.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block aspect-square rounded-lg overflow-hidden bg-gray-100"
                      >
                        <img
                          src={url}
                          alt={`Shirt ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="text-navy/60">No photos uploaded</p>
                )}
              </div>

              {/* Status Update */}
              <div>
                <h3 className="text-lg font-semibold text-navy mb-3">
                  Update Status
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {(Object.keys(statusLabels) as LeadStatus[]).map((status) => (
                    <button
                      key={status}
                      onClick={() => updateLeadStatus(selectedLead.id, status)}
                      disabled={updatingStatus === selectedLead.id}
                      className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedLead.status === status
                        ? `${statusColors[status]} ring-2 ring-offset-2 ring-navy/30`
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                      {statusLabels[status]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-navy mb-3">
                  Admin Notes (Internal Only)
                </h3>
                <div className="space-y-3">
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add internal notes about this lead (e.g., offer amount discussed, follow-up date)..."
                    className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-lg focus:border-navy focus:ring-2 focus:ring-navy/20 outline-none transition-colors min-h-[120px]"
                  />
                  <Button
                    onClick={updateLeadNotes}
                    isLoading={savingNotes}
                    disabled={adminNotes === (selectedLead.admin_notes || "")}
                    className="w-full bg-navy hover:bg-navy/90"
                  >
                    Save Internal Notes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
