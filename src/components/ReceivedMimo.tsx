
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReceivedMimoProps {
  id: string;
  username: string;
  amount: number;
  packageName: string;
  createdAt: Date;
  rewardDelivered: boolean;
  onViewClick: (id: string) => void;
}

const ReceivedMimo = ({
  id,
  username,
  amount,
  packageName,
  createdAt,
  rewardDelivered,
  onViewClick
}: ReceivedMimoProps) => {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { 
    addSuffix: true,
    locale: ptBR
  });

  return (
    <div className="mimo-card p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="bg-muted rounded-full h-10 w-10 flex items-center justify-center">
          <span className="font-medium text-sm">{username.substring(0, 2).toUpperCase()}</span>
        </div>
        <div>
          <h3 className="font-medium">{username}</h3>
          <div className="flex items-center text-xs text-foreground/60 gap-1">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      <div className="text-center md:text-left">
        <p className="font-medium text-lg">R${amount}</p>
        <p className="text-xs text-foreground/60">{packageName}</p>
      </div>

      <div>
        <span className={`px-2 py-1 rounded-full text-xs ${
          rewardDelivered 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {rewardDelivered ? 'Entregue' : 'Pendente'}
        </span>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="ml-auto flex items-center"
        onClick={() => onViewClick(id)}
      >
        <span>Ver detalhes</span>
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
};

export default ReceivedMimo;
