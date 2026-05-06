import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';

function Home() {
  const { products, fetchProducts, loading, error } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="home-page">
      <section className="hero">
        <h1>Welcome to E-Commerce App</h1>
        <p>Discover amazing products at great prices</p>
        <Link to="/products" className="cta-button">Shop Now</Link>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        {loading && <p>Loading products...</p>}
        {error && <p className="error-message">{error}</p>}
        {featuredProducts.length > 0 ? (
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        ) : (
          !loading && <p>No products available</p>
        )}
      </section>
    </div>
  );
}

export default Home;