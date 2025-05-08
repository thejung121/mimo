
import React from 'react';

interface PackageSummaryProps {
  packageTitle: string;
  packagePrice: number;
  showCreator?: boolean;
  creatorName?: string;
}

const PackageSummary = ({
  packageTitle,
  packagePrice,
  showCreator = false,
  creatorName,
}: PackageSummaryProps) => {
  return (
    <div className="bg-muted p-4 rounded-md">
      <h3 className="font-semibold mb-1">{packageTitle}</h3>
      <p className="text-2xl font-bold mb-2">R$ {packagePrice.toFixed(2)}</p>
      {showCreator && creatorName && (
        <p className="text-sm text-muted-foreground">
          Para: {creatorName}
        </p>
      )}
    </div>
  );
};

export default PackageSummary;
