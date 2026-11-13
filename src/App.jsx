import { useMemo, useState } from "react";
import { products } from "./challenges/products.js";

const formatPrice = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function App() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");

  const categories = useMemo(
    () => [...new Set(products.map((product) => product.category))].sort(),
    [],
  );

  const visibleProducts = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();
    const matchingProducts = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(searchTerm);
      const matchesCategory = category === "All" || product.category === category;
      return matchesName && matchesCategory;
    });

    return [...matchingProducts].sort((first, second) => {
      if (sortBy === "price-asc") return first.price - second.price;
      if (sortBy === "price-desc") return second.price - first.price;
      if (sortBy === "rating-desc") return second.rating - first.rating;
      return first.id - second.id;
    });
  }, [category, search, sortBy]);

  const averagePrice =
    visibleProducts.length === 0
      ? 0
      : visibleProducts.reduce((total, product) => total + product.price, 0) /
        visibleProducts.length;
  const hasFilters = search.trim() !== "" || category !== "All" || sortBy !== "default";

  function clearFilters() {
    setSearch("");
    setCategory("All");
    setSortBy("default");
  }

  return (
    <main className="page">
      <header className="page-header">
        <h1>Product Filter &amp; Sort</h1>
      </header>

      <section className="filters" aria-label="Filter products">
        <label>
          Search by name
          <input
            type="search"
            placeholder="Search products"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="All">All</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label>
          Sort by
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="default">Default order</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating-desc">Rating: high to low</option>
          </select>
        </label>

        <button type="button" onClick={clearFilters} disabled={!hasFilters}>
          Clear filters
        </button>
      </section>

      <div className="results-summary" aria-live="polite">
        <span>Showing {visibleProducts.length} of {products.length} products</span>
        {visibleProducts.length > 0 && (
          <span>Average price: {formatPrice.format(averagePrice)}</span>
        )}
      </div>

      {visibleProducts.length > 0 ? (
        <section className="product-grid" aria-label="Products">
          {visibleProducts.map((product) => (
            <article className="product-card" key={product.id}>
              <h2>{product.name}</h2>
              <p>{product.category}</p>
              <div className="product-details">
                <strong>{formatPrice.format(product.price)}</strong>
                <span>Rating: {product.rating.toFixed(1)}</span>
              </div>
            </article>
          ))}
        </section>
      ) : (
        <p className="empty-state">No products match your filters.</p>
      )}
    </main>
  );
}

export default App;
