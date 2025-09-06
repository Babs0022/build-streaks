// Base App integration utilities
export interface BaseAppContext {
  user: {
    fid: number;
    username: string;
    displayName: string;
    pfpUrl: string;
    address: string;
  };
  wallet: {
    address: string;
    chainId: number;
  };
}

declare global {
  interface Window {
    baseApp?: {
      getUser: () => Promise<BaseAppContext['user']>;
      getWallet: () => Promise<BaseAppContext['wallet']>;
      requestTransaction: (tx: any) => Promise<string>;
      onUserChange: (callback: (user: BaseAppContext['user']) => void) => void;
      onWalletChange: (callback: (wallet: BaseAppContext['wallet']) => void) => void;
    };
  }
}

export const getBaseAppContext = async (): Promise<BaseAppContext | null> => {
  if (typeof window === 'undefined' || !window.baseApp) {
    return null;
  }

  try {
    const [user, wallet] = await Promise.all([
      window.baseApp.getUser(),
      window.baseApp.getWallet()
    ]);

    return { user, wallet };
  } catch (error) {
    console.error('Error getting Base App context:', error);
    return null;
  }
};

export const requestTransaction = async (tx: any): Promise<string> => {
  if (typeof window === 'undefined' || !window.baseApp) {
    throw new Error('Base App not available');
  }

  try {
    return await window.baseApp.requestTransaction(tx);
  } catch (error) {
    console.error('Error requesting transaction:', error);
    throw error;
  }
};

export const subscribeToUserChanges = (callback: (user: BaseAppContext['user']) => void) => {
  if (typeof window !== 'undefined' && window.baseApp) {
    window.baseApp.onUserChange(callback);
  }
};

export const subscribeToWalletChanges = (callback: (wallet: BaseAppContext['wallet']) => void) => {
  if (typeof window !== 'undefined' && window.baseApp) {
    window.baseApp.onWalletChange(callback);
  }
};
