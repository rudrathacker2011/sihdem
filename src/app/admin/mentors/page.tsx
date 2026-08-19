"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

interface Mentor {
  id: string;
  name: string;
  fieldSpecialization: string[];
  bio: string | null;
  organization: string | null;
  assignments: Array<{ student: { name: string | null; email: string } }>;
}

export default function AdminMentorsPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    fieldSpecialization: "",
    bio: "",
    organization: "",
  });

  async function fetchMentors() {
    const res = await fetch("/api/mentors");
    if (res.ok) setMentors(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchMentors(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/mentors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          fieldSpecialization: form.fieldSpecialization.split(",").map((s) => s.trim()).filter(Boolean),
          bio: form.bio || null,
          organization: form.organization || null,
        }),
      });

      if (res.ok) {
        toast.add({ title: "Mentor created!", type: "success" });
        setForm({ name: "", fieldSpecialization: "", bio: "", organization: "" });
        setShowForm(false);
        fetchMentors();
      } else {
        const err = await res.json();
        toast.add({ title: "Error", description: err.error, type: "error" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">Mentor Management</h1>
          <Button onClick={() => setShowForm(!showForm)} id="add-mentor-btn">
            {showForm ? "Cancel" : "+ Add Mentor"}
          </Button>
        </div>

        {/* Add form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Mentor</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="mentor-name">Name *</Label>
                      <Input id="mentor-name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="Dr. Arun Sharma" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="mentor-org">Organization</Label>
                      <Input id="mentor-org" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="IIT Delhi" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="mentor-spec">Field Specializations (comma-separated) *</Label>
                      <Input id="mentor-spec" value={form.fieldSpecialization} onChange={(e) => setForm({ ...form, fieldSpecialization: e.target.value })} required placeholder="Software Engineering, Data Science, AI/ML" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label htmlFor="mentor-bio">Bio</Label>
                      <textarea
                        id="mentor-bio"
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={3}
                        placeholder="Brief background and expertise..."
                        className="w-full resize-none rounded-xl border border-input bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={submitting}>{submitting ? "Creating..." : "Create Mentor"}</Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Mentor table */}
        {mentors.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No mentors yet. Add your first mentor above.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {mentors.map((mentor, i) => (
              <motion.div
                key={mentor.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="border-border">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-xl">👨‍🏫</div>
                        <div>
                          <p className="font-semibold">{mentor.name}</p>
                          {mentor.organization && (
                            <p className="text-sm text-muted-foreground">{mentor.organization}</p>
                          )}
                          {mentor.bio && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{mentor.bio}</p>
                          )}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {mentor.fieldSpecialization.map((f) => (
                              <span key={f} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{f}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">{mentor.assignments.length}</p>
                        <p className="text-xs text-muted-foreground">students</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
