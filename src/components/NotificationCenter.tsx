
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Check, X, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { useDataFlow } from "@/hooks/useDataFlow";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationCenter = () => {
  const { notifications, markNotificationAsRead, loading } = useDataFlow();
  const [showAll, setShowAll] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const displayNotifications = showAll ? notifications : notifications.slice(0, 5);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Info className="h-4 w-4 text-blue-600" />;
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    markNotificationAsRead(notificationId);
  };

  if (loading && notifications.length === 0) {
    return <div className="text-center py-4">Loading notifications...</div>;
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
          {unreadNotifications.length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {unreadNotifications.length}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>Recent activity and updates</CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No notifications yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            <ScrollArea className="h-80">
              {displayNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 border rounded-lg ${
                    notification.read ? 'bg-gray-50' : 'bg-white border-primary/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium ${notification.read ? 'text-gray-600' : 'text-gray-900'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(notification.created_at).toLocaleString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
            
            {notifications.length > 5 && (
              <div className="text-center pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? 'Show Less' : `Show All (${notifications.length})`}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
