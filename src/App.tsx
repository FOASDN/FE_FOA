import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/Home";
// import VouchersPage from "./pages/Vouchers";
// import VoucherDetailPage from "./pages/VoucherDetail";
// import MenuPage from "./pages/Menu";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* <Route path="/vouchers" element={<VouchersPage />} />
        <Route path="/vouchers/:id" element={<VoucherDetailPage />} />
        <Route path="/menu" element={<MenuPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
