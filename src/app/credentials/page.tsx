'use client';

import { useState } from 'react';
import { useCredentials } from '@/hooks/use-credentials';
import { CredentialCard } from '@/components/credentials/credential-card';
import { CredentialForm } from '@/components/credentials/credential-form';
import { Credential } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, KeySquare, Loader2, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function CredentialsPage() {
  const { credentials, isLoading, deleteCredential } = useCredentials();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEdit = (credential: Credential) => {
    setSelectedCredential(credential);
    setIsFormOpen(true);
  };

  const handleCreate = () => {
    setSelectedCredential(null);
    setIsFormOpen(true);
  };

  const filteredCredentials = credentials.filter((c) => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <KeySquare className="h-8 w-8 text-primary" />
            Credentials Vault
          </h1>
          <p className="text-muted-foreground">Securely manage your passwords and account details.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search vault..."
              className="pl-8 bg-background/50 border-border/50 focus-visible:ring-primary/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Credential</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : filteredCredentials.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-border/50 rounded-xl bg-background/30">
            <KeySquare className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No credentials found</h3>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              {searchQuery ? 'Try adjusting your search query.' : 'Add your first password or account detail to secure it in your vault.'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreate}>Add Credential</Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
            {filteredCredentials.map((credential) => (
              <CredentialCard
                key={credential.id}
                credential={credential}
                onEdit={handleEdit}
                onDelete={deleteCredential}
              />
            ))}
          </div>
        )}
      </div>

      <CredentialForm
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        credential={selectedCredential}
      />
    </div>
  );
}
