import React, { useState } from 'react';
import { useAllSubscriptionPlans, useAdminSubscriptionMutations, SubscriptionPlan } from '@/hooks/useSubscriptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, Pencil, Trash2, Loader2, GripVertical, X } from 'lucide-react';

interface PlanFormData {
  plan: string;
  slug: string;
  audience: string;
  billing_period: string;
  price: number;
  currency: string;
  description: string;
  features: string[];
  max_child_profiles: number | null;
  games_per_day: number | null;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
}

const emptyForm: PlanFormData = {
  plan: '',
  slug: '',
  audience: 'parent',
  billing_period: 'monthly',
  price: 0,
  currency: 'USD',
  description: '',
  features: [],
  max_child_profiles: null,
  games_per_day: null,
  is_active: true,
  is_popular: false,
  sort_order: 0,
};

const SubscriptionsManager = () => {
  const { data: plans, isLoading } = useAllSubscriptionPlans();
  const { createPlan, updatePlan, deletePlan } = useAdminSubscriptionMutations();
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<PlanFormData>(emptyForm);
  const [newFeature, setNewFeature] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = (plan: SubscriptionPlan) => {
    setEditingId(plan.id);
    setForm({
      plan: plan.plan || '',
      slug: plan.slug || '',
      audience: plan.audience || 'parent',
      billing_period: plan.billing_period || 'monthly',
      price: plan.price || 0,
      currency: plan.currency || 'USD',
      description: plan.description || '',
      features: plan.features || [],
      max_child_profiles: plan.max_child_profiles,
      games_per_day: plan.games_per_day,
      is_active: plan.is_active ?? true,
      is_popular: plan.is_popular ?? false,
      sort_order: plan.sort_order || 0,
    });
    setFormOpen(true);
  };

  const handleSave = async () => {
    const payload = { ...form };
    if (editingId) {
      await updatePlan.mutateAsync({ id: editingId, ...payload } as any);
    } else {
      await createPlan.mutateAsync(payload as any);
    }
    setFormOpen(false);
  };

  const handleDelete = async () => {
    if (deleteId) {
      await deletePlan.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setForm(f => ({ ...f, features: [...f.features, newFeature.trim()] }));
      setNewFeature('');
    }
  };

  const removeFeature = (idx: number) => {
    setForm(f => ({ ...f, features: f.features.filter((_, i) => i !== idx) }));
  };

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Subscription Plans</h2>
        <Button onClick={openCreate}><Plus className="w-4 h-4 mr-2" />Add Plan</Button>
      </div>

      {/* Plans Table */}
      <Card className="bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Order</th>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Audience</th>
                  <th className="text-left p-3 font-medium">Period</th>
                  <th className="text-left p-3 font-medium">Price</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Popular</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {(plans || []).map((plan) => (
                  <tr key={plan.id} className="border-b hover:bg-muted/30">
                    <td className="p-3"><GripVertical className="w-4 h-4 text-muted-foreground inline" /> {plan.sort_order}</td>
                    <td className="p-3 font-medium">{plan.plan}</td>
                    <td className="p-3"><Badge variant="outline">{plan.audience}</Badge></td>
                    <td className="p-3">{plan.billing_period}</td>
                    <td className="p-3">{plan.currency} {plan.price}</td>
                    <td className="p-3">
                      <Badge variant={plan.is_active ? 'default' : 'secondary'}>
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="p-3">{plan.is_popular ? '⭐' : '—'}</td>
                    <td className="p-3 text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(plan)}><Pencil className="w-4 h-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(plan.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                    </td>
                  </tr>
                ))}
                {(!plans || plans.length === 0) && (
                  <tr><td colSpan={8} className="p-8 text-center text-muted-foreground">No subscription plans yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Plan' : 'Create Plan'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Plan Name</Label>
                <Input value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))} placeholder="e.g. Family" />
              </div>
              <div className="space-y-2">
                <Label>Slug</Label>
                <Input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="e.g. family-monthly" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={form.audience} onValueChange={v => setForm(f => ({ ...f, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="school">School</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Billing Period</Label>
                <Select value={form.billing_period} onValueChange={v => setForm(f => ({ ...f, billing_period: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Currency</Label>
                <Input value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: parseFloat(e.target.value) || 0 }))} />
              </div>
              <div className="space-y-2">
                <Label>Max Child Profiles</Label>
                <Input type="number" value={form.max_child_profiles ?? ''} onChange={e => setForm(f => ({ ...f, max_child_profiles: e.target.value ? parseInt(e.target.value) : null }))} placeholder="null = unlimited" />
              </div>
              <div className="space-y-2">
                <Label>Games Per Day</Label>
                <Input type="number" value={form.games_per_day ?? ''} onChange={e => setForm(f => ({ ...f, games_per_day: e.target.value ? parseInt(e.target.value) : null }))} placeholder="null = unlimited" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} />
            </div>

            <div className="space-y-2">
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: parseInt(e.target.value) || 0 }))} />
            </div>

            {/* Features */}
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input value={newFeature} onChange={e => setNewFeature(e.target.value)} placeholder="Add a feature..." onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addFeature())} />
                <Button type="button" variant="outline" onClick={addFeature}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.features.map((f, i) => (
                  <Badge key={i} variant="secondary" className="gap-1 py-1">
                    {f}
                    <button onClick={() => removeFeature(i)}><X className="w-3 h-3" /></button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Switch checked={form.is_active} onCheckedChange={v => setForm(f => ({ ...f, is_active: v }))} />
                <Label>Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch checked={form.is_popular} onCheckedChange={v => setForm(f => ({ ...f, is_popular: v }))} />
                <Label>Popular</Label>
              </div>
            </div>

            <Button onClick={handleSave} disabled={createPlan.isPending || updatePlan.isPending} className="w-full">
              {(createPlan.isPending || updatePlan.isPending) ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingId ? 'Update Plan' : 'Create Plan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Plan?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this subscription plan.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubscriptionsManager;
