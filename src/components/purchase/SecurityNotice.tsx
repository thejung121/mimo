
import React from 'react';
import { Lock } from 'lucide-react';

interface SecurityNoticeProps {
  message: string;
}

const SecurityNotice = ({ message }: SecurityNoticeProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground p-2 border border-muted rounded-md">
      <Lock className="h-4 w-4 text-green-500" />
      <span>{message}</span>
    </div>
  );
};

export default SecurityNotice;
