
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ExternalLink, Star, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceToolCardProps {
  tool: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    downloads: number;
    price: string;
    image: string;
    features: string[];
    installed?: boolean;
  };
}

export const MarketplaceToolCard = ({ tool }: MarketplaceToolCardProps) => {
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(tool.installed || false);
  const { toast } = useToast();

  const handleInstall = async () => {
    setInstalling(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Simulate installation process
      await new Promise(resolve => setTimeout(resolve, 2000));

      const { error } = await supabase
        .from('marketplace_tools')
        .insert({
          tool_id: tool.id,
          tool_name: tool.name,
          user_id: user.id,
          status: 'installed',
          version: '1.0.0',
          configuration: {}
        });

      if (error) throw error;

      setInstalled(true);
      toast({
        title: "Tool Installed",
        description: `${tool.name} has been installed successfully!`,
      });
    } catch (error: any) {
      console.error('Error installing tool:', error);
      toast({
        title: "Installation Failed",
        description: error.message || "Failed to install tool. Please try again.",
        variant: "destructive",
      });
    } finally {
      setInstalling(false);
    }
  };

  const handleLearnMore = () => {
    // Open tool documentation or details page
    window.open(`/marketplace/tool/${tool.id}`, '_blank');
  };

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">{tool.name[0]}</span>
              </div>
              {tool.name}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">{tool.category}</Badge>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">{tool.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{tool.downloads.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">{tool.price}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        <CardDescription className="mb-4 line-clamp-3">
          {tool.description}
        </CardDescription>
        
        <div className="mb-4">
          <h4 className="font-medium text-sm mb-2">Key Features:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {tool.features.slice(0, 3).map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="mt-auto space-y-2">
          {installed ? (
            <Button className="w-full" disabled>
              <Download className="mr-2 h-4 w-4" />
              Installed
            </Button>
          ) : (
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              onClick={handleInstall}
              disabled={installing}
            >
              {installing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Installing...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Install Tool
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            className="w-full"
            onClick={handleLearnMore}
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            Learn More
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
