import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  ArrowLeft,
  Baby,
  BarChart3,
  Trash2,
  Loader2,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ParentProfile {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
}

interface ChildProfile {
  id: string;
  name: string;
  age: number;
  avatar: string | null;
  created_at: string;
}

interface ProgressRecord {
  id: string;
  activity_id: string | null;
  completed: boolean | null;
  stars_earned: number | null;
  time_spent_seconds: number | null;
}

export function UsersManager() {
  const [parents, setParents] = useState<ParentProfile[]>([]);
  const [loadingParents, setLoadingParents] = useState(true);
  const [selectedParent, setSelectedParent] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [childProgress, setChildProgress] = useState<Record<string, ProgressRecord[]>>({});
  const [loadingProgress, setLoadingProgress] = useState<string | null>(null);
  const [resetChildId, setResetChildId] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const { toast } = useToast();

  // Fetch all parents
  useEffect(() => {
    const fetchParents = async () => {
      setLoadingParents(true);
      try {
        const { data, error } = await (supabase as any)
          .from('profiles')
          .select('id, user_id, first_name, last_name, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setParents(data || []);
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      } finally {
        setLoadingParents(false);
      }
    };
    fetchParents();
  }, [toast]);

  // When a parent is selected, fetch their children
  const selectParent = async (parent: ParentProfile) => {
    setSelectedParent(parent);
    setChildren([]);
    setChildProgress({});
    setLoadingChildren(true);
    try {
      const { data, error } = await (supabase as any)
        .from('child_profiles')
        .select('id, name, age, avatar, created_at')
        .eq('parent_id', parent.user_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setChildren(data || []);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingChildren(false);
    }
  };

  // Fetch progress for a child
  const viewProgress = async (childId: string) => {
    if (childProgress[childId]) return; // already loaded
    setLoadingProgress(childId);
    try {
      const { data, error } = await (supabase as any)
        .from('progress')
        .select('id, activity_id, completed, stars_earned, time_spent_seconds')
        .eq('child_id', childId);
      if (error) throw error;
      setChildProgress((prev) => ({ ...prev, [childId]: data || [] }));
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setLoadingProgress(null);
    }
  };

  // Reset progress
  const handleResetProgress = async () => {
    if (!resetChildId) return;
    setResetting(true);
    try {
      const { error } = await (supabase as any)
        .from('progress')
        .delete()
        .eq('child_id', resetChildId);
      if (error) throw error;
      setChildProgress((prev) => ({ ...prev, [resetChildId]: [] }));
      toast({ title: 'Progress reset', description: 'All progress records deleted for this child.' });
      setResetChildId(null);
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' });
    } finally {
      setResetting(false);
    }
  };

  const getChildName = (id: string) => children.find((c) => c.id === id)?.name || 'this child';

  // Parent list view
  if (!selectedParent) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Parents
        </h2>
        {loadingParents ? (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : parents.length === 0 ? (
          <Card className="bg-white">
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>No parents registered yet.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parents.map((p) => (
                  <TableRow key={p.id} className="cursor-pointer" onClick={() => selectParent(p)}>
                    <TableCell className="font-medium">
                      {[p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unnamed'}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(p.created_at), { addSuffix: true })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => selectParent(p)}>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    );
  }

  // Parent detail view
  const parentName = [selectedParent.first_name, selectedParent.last_name].filter(Boolean).join(' ') || 'Unnamed';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => setSelectedParent(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <h2 className="text-xl font-semibold">{parentName}</h2>
        <Badge variant="secondary" className="text-xs">
          Joined {formatDistanceToNow(new Date(selectedParent.created_at), { addSuffix: true })}
        </Badge>
      </div>

      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Baby className="h-4 w-4" />
            Children ({children.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingChildren ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
            </div>
          ) : children.length === 0 ? (
            <p className="text-sm text-muted-foreground">No children added.</p>
          ) : (
            <div className="space-y-4">
              {children.map((child) => (
                <Card key={child.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-xs text-muted-foreground">Age: {child.age}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewProgress(child.id)}
                          disabled={loadingProgress === child.id}
                        >
                          {loadingProgress === child.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                          ) : (
                            <BarChart3 className="h-3.5 w-3.5 mr-1" />
                          )}
                          View Progress
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive border-destructive/30 hover:bg-destructive/10"
                          onClick={() => setResetChildId(child.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Reset Progress
                        </Button>
                      </div>
                    </div>

                    {/* Progress rows */}
                    {childProgress[child.id] && (
                      childProgress[child.id].length === 0 ? (
                        <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">No progress records.</p>
                      ) : (
                        <div className="bg-muted/50 rounded-lg p-3">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead className="text-xs">Activity ID</TableHead>
                                <TableHead className="text-xs">Completed</TableHead>
                                <TableHead className="text-xs">Stars</TableHead>
                                <TableHead className="text-xs">Time (s)</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {childProgress[child.id].map((p) => (
                                <TableRow key={p.id}>
                                  <TableCell className="text-xs font-mono truncate max-w-[120px]">{p.activity_id?.slice(0, 8)}…</TableCell>
                                  <TableCell>
                                    <Badge variant={p.completed ? 'default' : 'secondary'} className="text-[10px]">
                                      {p.completed ? 'Yes' : 'No'}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-xs">{p.stars_earned ?? 0}</TableCell>
                                  <TableCell className="text-xs">{p.time_spent_seconds ?? 0}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset confirm */}
      <AlertDialog open={!!resetChildId} onOpenChange={() => setResetChildId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset all progress?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>all progress records</strong> for <strong>{getChildName(resetChildId || '')}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={resetting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleResetProgress}
              disabled={resetting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {resetting && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
              Reset Progress
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
