import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from "@tanstack/react-query";
import App from './App.jsx'
import queryClient from "./query/queryClient.js";


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
   <App />
  </QueryClientProvider>
   
)
