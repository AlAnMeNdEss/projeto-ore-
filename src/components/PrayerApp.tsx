import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { PrayerRequestForm } from './PrayerRequestForm';
import { PrayerRequestsList } from './PrayerRequestsList';
import { Heart, Plus, List, LogOut, User } from 'lucide-react';

export function PrayerApp() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'list' | 'create'>('list');

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-spiritual bg-cover bg-center bg-fixed">
      <div className="min-h-screen bg-gradient-spiritual backdrop-blur-sm">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-prayer flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">
                  Orações Compartilhadas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Comunidade de oração e fé
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {user && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
              )}
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <Card className="p-1 shadow-soft border-0">
            <div className="flex gap-1">
              <Button
                variant={activeTab === 'list' ? 'default' : 'ghost'}
                className={activeTab === 'list' ? 'bg-gradient-prayer' : ''}
                onClick={() => setActiveTab('list')}
              >
                <List className="h-4 w-4 mr-2" />
                Ver Pedidos
              </Button>
              <Button
                variant={activeTab === 'create' ? 'default' : 'ghost'}
                className={activeTab === 'create' ? 'bg-gradient-prayer' : ''}
                onClick={() => setActiveTab('create')}
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Pedido
              </Button>
            </div>
          </Card>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {activeTab === 'list' ? (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Pedidos de Oração</h2>
                <p className="text-muted-foreground">
                  Clique em "Orar" para registrar sua oração e apoio
                </p>
              </div>
              <PrayerRequestsList />
            </div>
          ) : (
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Novo Pedido</h2>
                <p className="text-muted-foreground">
                  Compartilhe seu pedido com nossa comunidade
                </p>
              </div>
              <div className="max-w-2xl mx-auto">
                <PrayerRequestForm />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-background/50 border-t border-border/50 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="h-5 w-5 text-prayer-primary" />
              <span className="text-sm text-muted-foreground">
                Feito com amor e fé
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              "Orai uns pelos outros, para que sareis." - Tiago 5:16
            </p>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
}