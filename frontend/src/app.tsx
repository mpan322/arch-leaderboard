import React from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { AlertProvider } from './components/alert';
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AlertProvider>
        <Outlet />
      </AlertProvider>
    </QueryClientProvider>
  );
};

export default App;


