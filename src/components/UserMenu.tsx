
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

export const UserMenu = () => {
  return (
    <Button variant="ghost" className="relative h-8 w-8 rounded-full" disabled>
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary text-primary-foreground">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </Button>
  );
};
