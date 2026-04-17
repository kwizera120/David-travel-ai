import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './context/AuthContext';
import { AIChatbot } from './components/AIChatbot';

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <AIChatbot />
    </AuthProvider>
  );
}

export default App;