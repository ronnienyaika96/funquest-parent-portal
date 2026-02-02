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
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Edit, Trash2, MoreVertical, Eye, EyeOff, Image } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, currentStatus: string) => void;
}

export function ActivityList({ 
  activities, 
  onEdit, 
  onDelete, 
  onTogglePublish 
}: ActivityListProps) {
  if (activities.length === 0) {
    return (
      <Card className="bg-white border-2 border-dashed border-muted">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Image className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground">No activities yet</p>
          <p className="text-sm text-muted-foreground">Create your first activity to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Preview</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Age Range</TableHead>
            <TableHead>Steps</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Updated</TableHead>
            <TableHead className="w-16">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow key={activity.id}>
              <TableCell>
                {activity.thumbnail_url ? (
                  <img 
                    src={activity.thumbnail_url} 
                    alt={activity.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    <Image className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{activity.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {activity.category}
                </Badge>
              </TableCell>
              <TableCell>{activity.age_range}</TableCell>
              <TableCell>{activity.steps.length} steps</TableCell>
              <TableCell>
                <Badge 
                  variant={activity.status === 'published' ? 'default' : 'outline'}
                  className={activity.status === 'published' 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : ''
                  }
                >
                  {activity.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {format(new Date(activity.updated_at), 'MMM d, yyyy')}
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
                    <DropdownMenuItem 
                      onClick={() => onTogglePublish(activity.id, activity.status)}
                    >
                      {activity.status === 'published' ? (
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
