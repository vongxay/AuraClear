
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WishlistProvider } from './contexts/WishlistContext';
import Index from './pages/Index';
import ProductDetail from './pages/ProductDetail';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import NotFound from './pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Toaster position="top-right" />
    </WishlistProvider>
  );
}

export default App;
