import { Credential } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Key, Copy, Eye, EyeOff, Globe, Trash2, Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CredentialCardProps {
  credential: Credential;
  onEdit: (credential: Credential) => void;
  onDelete: (id: string) => void;
}

export function CredentialCard({ credential, onEdit, onDelete }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  return (
    <Card className="glass-card hover:border-primary/50 transition-colors group">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            {credential.title}
          </CardTitle>
          {credential.url && (
            <CardDescription className="flex items-center gap-1 mt-1">
              <Globe className="h-3 w-3" />
              <a href={credential.url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-primary transition-colors">
                {new URL(credential.url.startsWith('http') ? credential.url : `https://${credential.url}`).hostname}
              </a>
            </CardDescription>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(credential)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDelete(credential.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Username */}
        {credential.username && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Username / Email</div>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted/50 px-2 py-1 rounded flex-1 truncate font-mono">
                {credential.username}
              </code>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(credential.username, 'Username')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Password */}
        {credential.password && (
          <div className="space-y-1">
            <div className="text-xs font-medium text-muted-foreground">Password</div>
            <div className="flex items-center gap-2">
              <code className="text-sm bg-muted/50 px-2 py-1 rounded flex-1 truncate font-mono tracking-widest">
                {showPassword ? credential.password : '••••••••••••'}
              </code>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => copyToClipboard(credential.password!, 'Password')}>
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
