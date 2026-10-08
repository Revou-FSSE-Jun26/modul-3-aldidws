export default function Header() {
  return (
    <header className="flex justify-between items-center border-b px-6 py-3">
      <span className="font-bold text-lg">RevoShop</span>
      <nav className="flex gap-4 text-sm text-gray-600">
        <span>Home</span><span className="font-semibold text-black">Products</span>
        <span>Categories</span><span>Orders</span>
      </nav>
    </header>
  );
}