import { useAdminStats } from '@/hooks/useAdminStats';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  FileText,
  CheckCircle,
  FileEdit,
  Users,
  Baby,
  Gamepad2,
  Clock,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const kpiConfig = [
  { key: 'totalActivities' as const, label: 'Total Activities', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  { key: 'publishedActivities' as const, label: 'Published', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
  { key: 'draftActivities' as const, label: 'Drafts', icon: FileEdit, color: 'text-amber-600', bg: 'bg-amber-50' },
  { key: 'totalParents' as const, label: 'Total Parents', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
  { key: 'totalChildren' as const, label: 'Total Children', icon: Baby, color: 'text-pink-600', bg: 'bg-pink-50' },
  { key: 'totalPlays' as const, label: 'Total Plays', icon: Gamepad2, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export function AdminOverview() {
  const { stats, statsLoading, recentActivity, recentLoading } = useAdminStats();

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiConfig.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.key} className="bg-white">
              <CardContent className="flex items-center gap-4 p-5">
                <div className={`${kpi.bg} p-3 rounded-xl`}>
                  <Icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <p className="text-2xl font-bold">{stats?.[kpi.key] ?? 0}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <p className="text-muted-foreground text-sm">No activities yet.</p>
          ) : (
            <div className="divide-y">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.type} · {item.created_at
                          ? formatDistanceToNow(new Date(item.created_at), { addSuffix: true })
                          : 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <Badge variant={item.is_published ? 'default' : 'secondary'} className="shrink-0 ml-2">
                    {item.is_published ? 'Published' : 'Draft'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
