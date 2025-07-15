// src/context/ModalContext.tsx
import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type AddMoneyCallback = (amount: number) => void;

interface ModalContextType {
  requestAddMoneyModal: () => void; 
  registerAddMoneyHandler: (handler: AddMoneyCallback) => void;
  unregisterAddMoneyHandler: (handler: AddMoneyCallback) => void; 
  isAddMoneyModalRequested: boolean;
  onAddMoneyModalClose: () => void;
  onAddMoneyModalSubmit: AddMoneyCallback; 
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isAddMoneyModalRequested, setIsAddMoneyModalRequested] = useState(false);
  const [activeAddMoneyHandler, setActiveAddMoneyHandler] = useState<AddMoneyCallback | null>(null);

  const requestAddMoneyModal = useCallback(() => { //
    setIsAddMoneyModalRequested(true);
  }, []);

  const registerAddMoneyHandler = useCallback((handler: AddMoneyCallback) => {
    setActiveAddMoneyHandler(() => handler); 
  }, []);

  const unregisterAddMoneyHandler = useCallback((handler: AddMoneyCallback) => {
    setActiveAddMoneyHandler((prevHandler: AddMoneyCallback | null) => (prevHandler === handler ? null : prevHandler));
  }, []);

  const onAddMoneyModalSubmit = useCallback((amount: number) => {
    if (activeAddMoneyHandler) { 
      activeAddMoneyHandler(amount); 
    }
    onAddMoneyModalClose(); 
  }, [activeAddMoneyHandler]); 

  const onAddMoneyModalClose = useCallback(() => {
    setIsAddMoneyModalRequested(false);
  }, []);


  const value = {
    requestAddMoneyModal,
    registerAddMoneyHandler,
    unregisterAddMoneyHandler,
    isAddMoneyModalRequested,
    onAddMoneyModalClose,
    onAddMoneyModalSubmit 
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};