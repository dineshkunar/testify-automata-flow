import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Settings, Trash2, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  logo_url: string;
  configuration_schema: any; // JSON schema for configuration
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface IntegrationConfiguration {
  id: string;
  integration_id: string;
  configuration_data: any; // JSON object matching the schema
  is_valid: boolean;
  last_sync_at: string;
  created_at: string;
  updated_at: string;
}

interface IntegrationManagerProps {
  integration: Integration;
  onClose: () => void;
  onSave: () => void;
}

const IntegrationManager: React.FC<IntegrationManagerProps> = ({ integration, onClose, onSave }) => {
  const { toast } = useToast();
  const [configData, setConfigData] = useState<any>({});
  const [isConfigValid, setIsConfigValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load existing configuration if available
    const fetchConfiguration = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('integration_configurations')
          .select('*')
          .eq('integration_id', integration.id)
          .single();

        if (error) {
          console.error('Error fetching integration configuration:', error);
          // Optionally show a toast message here if the error is user-facing
        }

        if (data) {
          setConfigData(data.configuration_data);
          setIsConfigValid(data.is_valid);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfiguration();
  }, [integration.id]);

  const handleInputChange = (key: string, value: any) => {
    setConfigData({ ...configData, [key]: value });
    // You might want to add validation logic here based on the schema
    // For simplicity, we'll assume the config is valid on any change
    setIsConfigValid(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Check if a configuration already exists
      const { data: existingConfig, error: existingConfigError } = await supabase
        .from('integration_configurations')
        .select('id')
        .eq('integration_id', integration.id)
        .single();

      if (existingConfigError && existingConfigError.code !== 'PGRST116') {
        console.error('Error checking existing configuration:', existingConfigError);
        toast({
          title: 'Error',
          description: 'Failed to save integration configuration.',
          variant: 'destructive',
        });
        return;
      }

      if (existingConfig) {
        // Update existing configuration
        const { error } = await supabase
          .from('integration_configurations')
          .update({ configuration_data: configData, is_valid: isConfigValid })
          .eq('integration_id', integration.id);

        if (error) {
          console.error('Error updating integration configuration:', error);
          toast({
            title: 'Error',
            description: 'Failed to update integration configuration.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Integration configuration updated successfully.',
          });
          onSave(); // Notify parent component to refresh data
        }
      } else {
        // Create new configuration
        const { error } = await supabase
          .from('integration_configurations')
          .insert([{ integration_id: integration.id, configuration_data: configData, is_valid: isConfigValid }]);

        if (error) {
          console.error('Error creating integration configuration:', error);
          toast({
            title: 'Error',
            description: 'Failed to create integration configuration.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Success',
            description: 'Integration configuration created successfully.',
          });
          onSave(); // Notify parent component to refresh data
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{integration.name} Configuration</CardTitle>
        <CardDescription>{integration.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {integration.configuration_schema &&
          Object.entries(integration.configuration_schema.properties).map(
            ([key, property]: [string, any]) => (
              <div key={key} className="grid gap-2">
                <Label htmlFor={key}>{property.title || key}</Label>
                {property.type === 'string' && (
                  <Input
                    id={key}
                    type="text"
                    placeholder={property.description}
                    value={configData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
                {property.type === 'integer' && (
                  <Input
                    id={key}
                    type="number"
                    placeholder={property.description}
                    value={configData[key] || ''}
                    onChange={(e) => handleInputChange(key, parseInt(e.target.value))}
                  />
                )}
                 {property.type === 'boolean' && (
                  <Input
                    id={key}
                    type="checkbox"
                    checked={configData[key] || false}
                    onChange={(e) => handleInputChange(key, e.target.checked)}
                  />
                )}
                {property.type === 'text' && (
                  <Textarea
                    id={key}
                    placeholder={property.description}
                    value={configData[key] || ''}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                )}
              </div>
            )
          )}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!isConfigValid || isLoading}>
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationManager;
