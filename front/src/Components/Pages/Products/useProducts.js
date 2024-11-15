import { useState, useEffect } from 'react';
import axios from 'axios';

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    // Fetch categories dynamically from the backend
    axios
      .get('/api/inventory/categories')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error fetching categories:', error));

    // Fetch products based on selected category and sort options
    fetchProducts();
  }, [selectedCategory, sortOption]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/inventory/allItems');
      let items = response.data;

      // Filter by category
      if (selectedCategory) {
        items = items.filter((item) => item.category === selectedCategory);
      }

      // Sort items based on sortOption
      if (sortOption === 'price_asc') {
        items = items.sort(
          (a, b) =>
            a.variants[0].prices.suggestedRetailPrice -
            b.variants[0].prices.suggestedRetailPrice
        );
      } else if (sortOption === 'price_desc') {
        items = items.sort(
          (a, b) =>
            b.variants[0].prices.suggestedRetailPrice -
            a.variants[0].prices.suggestedRetailPrice
        );
      } else if (sortOption === 'name_asc') {
        items = items.sort((a, b) => a.productName.localeCompare(b.productName));
      } else if (sortOption === 'name_desc') {
        items = items.sort((a, b) => b.productName.localeCompare(a.productName));
      }

      setProducts(items);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  return {
    products,
    categories,
    selectedCategory,
    setSelectedCategory,
    sortOption,
    setSortOption,
  };
};

export default useProducts;
