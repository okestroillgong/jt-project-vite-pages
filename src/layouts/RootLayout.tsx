import { Outlet } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

export default function RootLayout() {
  return (
    <div className="font-inter">
      <Outlet />
      <Toaster
        position="top-center"
        toastOptions={{
          classNames: {
            success: 'bg-green-50 border-green-200 text-green-800',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
            error: 'bg-red-50 border-red-200 text-red-800',
          },
        }}
      />
    </div>
  );
}
