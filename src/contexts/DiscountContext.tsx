import { createContext, useContext, useState, ReactNode } from 'react';

export interface Discount {
  code: string;
  percentOff: number;
  source: 'minigame';
  applied: boolean;
  friesCaught?: number;
}

interface DiscountContextType {
  discount: Discount | null;
  applyDiscount: (discount: Discount) => void;
  clearDiscount: () => void;
  getDiscountedPrice: (originalPrice: number) => number;
}

const DiscountContext = createContext<DiscountContextType | undefined>(undefined);

export const DiscountProvider = ({ children }: { children: ReactNode }) => {
  const [discount, setDiscount] = useState<Discount | null>(null);

  const applyDiscount = (newDiscount: Discount) => {
    setDiscount({ ...newDiscount, applied: true });
  };

  const clearDiscount = () => {
    setDiscount(null);
  };

  const getDiscountedPrice = (originalPrice: number): number => {
    if (!discount || !discount.applied) return originalPrice;
    const discountAmount = originalPrice * (discount.percentOff / 100);
    return Math.max(0, originalPrice - discountAmount);
  };

  return (
    <DiscountContext.Provider
      value={{
        discount,
        applyDiscount,
        clearDiscount,
        getDiscountedPrice,
      }}
    >
      {children}
    </DiscountContext.Provider>
  );
};

export const useDiscount = () => {
  const context = useContext(DiscountContext);
  if (context === undefined) {
    throw new Error('useDiscount must be used within a DiscountProvider');
  }
  return context;
};
