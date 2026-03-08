import { Activity } from '@/hooks/useActivities';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Eye, EyeOff, FileText } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentlyPublished: boolean) => void;
}

export function ActivityList({
  activities,
  onEdit,
  onDelete,
  onTogglePublish,
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-card border-2 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No activities yet</p>
          <p className="text-sm text-muted-foreground">Create your first activity to get started</p>
        </CardContent>
      </Card>
    );
  }

  const ageRangeLabel = (a: Activity) => {
    if (a.age_min != null && a.age_max != null) return `${a.age_min}–${a.age_max}`;
    if (a.age_min != null) return `${a.age_min}+`;
    if (a.age_max != null) return `Up to ${a.age_max}`;
    return '—';
  };

  return (
    <Card className="bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Age Range</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell className="font-medium">{activity.title}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {activity.type}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-[120px] truncate">
                {activity.value || '—'}
              </TableCell>
              <TableCell>{ageRangeLabel(activity)}</TableCell>
              <TableCell>{activity.steps.length} steps</TableCell>
              <TableCell>
                <Badge variant={activity.is_published ? 'default' : 'outline'}>
                  {activity.is_published ? 'Published' : 'Draft'}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {activity.created_at
                  ? format(new Date(activity.created_at), 'MMM d, yyyy')
                  : '—'}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(activity)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onTogglePublish(activity.id, activity.is_published)}>
                      {activity.is_published ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Unpublish
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Publish
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(activity.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
