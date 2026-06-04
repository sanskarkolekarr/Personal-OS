import { Credential, CredentialFormData } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { useCredentials } from '@/hooks/use-credentials';
import { Save } from 'lucide-react';

interface CredentialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  credential?: Credential | null;
}

export function CredentialForm({ open, onOpenChange, credential }: CredentialFormProps) {
  const { addCredential, updateCredential } = useCredentials();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CredentialFormData>({
    title: '',
    username: '',
    password: '',
    url: '',
    notes: '',
    category: 'general',
  });

  useEffect(() => {
    if (credential) {
      setFormData({
        title: credential.title,
        username: credential.username,
        password: credential.password || '',
        url: credential.url,
        notes: credential.notes,
        category: credential.category,
      });
    } else {
      setFormData({
        title: '',
        username: '',
        password: '',
        url: '',
        notes: '',
        category: 'general',
      });
    }
  }, [credential, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (credential) {
        await updateCredential(credential.id, formData);
      } else {
        await addCredential(formData);
      }
      onOpenChange(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto bg-background/95 backdrop-blur border-l-border/40">
        <SheetHeader>
          <SheetTitle>{credential ? 'Edit Credential' : 'Add Credential'}</SheetTitle>
          <SheetDescription>
            {credential ? 'Update your saved credential details.' : 'Securely save a new password or account.'}
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title (Service Name) *</Label>
            <Input
              id="title"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Netflix, Github, Bank"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username or Email</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="user@example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="url">URL (Website)</Label>
            <Input
              id="url"
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Recovery codes or extra info..."
              className="resize-none h-24"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? 'Saving...' : 'Save Credential'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
