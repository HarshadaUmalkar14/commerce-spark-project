
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '@/services/api';
import ProductGrid from '@/components/ProductGrid';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { CheckCircle2, X, SlidersHorizontal } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const ProductsPage: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [filters, setFilters] = useState({
    category: queryParams.get('category') || '',
    search: queryParams.get('search') || '',
    sort: queryParams.get('sort') || 'featured',
    minPrice: 0,
    maxPrice: 1000,
  });

  const [priceRange, setPriceRange] = useState([filters.minPrice, filters.maxPrice]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category) params.set('category', filters.category);
    if (filters.search) params.set('search', filters.search);
    if (filters.sort !== 'featured') params.set('sort', filters.sort);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [filters]);

  // Fetch products with current filters
  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['products', filters],
    queryFn: () => fetchProducts(filters),
  });

  // Fetch categories for filter
  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formElement = e.target as HTMLFormElement;
    const searchInput = formElement.elements.namedItem('search') as HTMLInputElement;
    
    setFilters(prev => ({
      ...prev,
      search: searchInput.value
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category
    }));
  };

  const handleSortChange = (value: string) => {
    setFilters(prev => ({
      ...prev,
      sort: value
    }));
  };

  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
  };

  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev,
      minPrice: priceRange[0],
      maxPrice: priceRange[1]
    }));
    setIsMobileFiltersOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      search: '',
      sort: 'featured',
      minPrice: 0,
      maxPrice: 1000,
    });
    setPriceRange([0, 1000]);
  };

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen(!isMobileFiltersOpen);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile filter button */}
        <div className="md:hidden mb-4">
          <Button 
            onClick={toggleMobileFilters}
            variant="outline"
            className="w-full flex items-center justify-center"
          >
            <SlidersHorizontal className="mr-2" size={18} />
            {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>

        {/* Sidebar filters - desktop always visible, mobile conditionally */}
        <aside 
          className={`
            md:w-64 bg-white p-4 rounded-lg shadow-sm
            ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-xs text-gray-500"
            >
              Clear All
            </Button>
          </div>
          
          {/* Categories filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              {categories?.map(category => (
                <div 
                  key={category.id} 
                  className="flex items-center"
                >
                  <button
                    onClick={() => handleCategoryChange(category.name)}
                    className={`
                      flex items-center w-full px-2 py-1 rounded
                      ${filters.category === category.name ? 
                        'bg-shop-blue-light text-shop-blue' : 
                        'hover:bg-gray-100'
                      }
                    `}
                  >
                    {filters.category === category.name && (
                      <CheckCircle2 size={16} className="mr-2 text-shop-blue" />
                    )}
                    <span>{category.name}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Price range filter */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Price Range</h3>
            <div className="px-2">
              <Slider
                defaultValue={[filters.minPrice, filters.maxPrice]}
                value={priceRange}
                min={0}
                max={1000}
                step={10}
                onValueChange={handlePriceChange}
                className="mb-6"
              />
              
              <div className="flex justify-between mb-4">
                <div className="w-[45%]">
                  <p className="text-xs text-gray-500 mb-1">Min</p>
                  <Input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="h-8"
                  />
                </div>
                <div className="w-[45%]">
                  <p className="text-xs text-gray-500 mb-1">Max</p>
                  <Input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="h-8"
                  />
                </div>
              </div>
              
              <Button onClick={applyPriceFilter} className="w-full">
                Apply
              </Button>
            </div>
          </div>
          
          {/* Mobile close button */}
          <div className="md:hidden mt-6">
            <Button 
              onClick={() => setIsMobileFiltersOpen(false)}
              variant="outline"
              className="w-full"
            >
              <X className="mr-2" size={18} />
              Close Filters
            </Button>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Search and sort bar */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Input
                  name="search"
                  placeholder="Search products..."
                  defaultValue={filters.search}
                  className="w-full"
                />
                <Button 
                  type="submit" 
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full"
                >
                  Search
                </Button>
              </div>
            </form>
            
            <Select
              value={filters.sort}
              onValueChange={handleSortChange}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Best Rating</SelectItem>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Applied filters */}
          {(filters.category || filters.search || 
            filters.minPrice > 0 || filters.maxPrice < 1000) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {filters.category && (
                <div className="bg-shop-blue-light text-shop-blue text-sm rounded-full px-3 py-1 flex items-center">
                  Category: {filters.category}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                    className="ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {filters.search && (
                <div className="bg-shop-blue-light text-shop-blue text-sm rounded-full px-3 py-1 flex items-center">
                  Search: {filters.search}
                  <button 
                    onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                    className="ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {(filters.minPrice > 0 || filters.maxPrice < 1000) && (
                <div className="bg-shop-blue-light text-shop-blue text-sm rounded-full px-3 py-1 flex items-center">
                  Price: ${filters.minPrice} - ${filters.maxPrice}
                  <button 
                    onClick={() => {
                      setFilters(prev => ({ ...prev, minPrice: 0, maxPrice: 1000 }));
                      setPriceRange([0, 1000]);
                    }}
                    className="ml-1"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Products grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-48 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : products?.length ? (
            <div>
              <p className="text-sm text-gray-500 mb-4">
                Showing {products.length} product{products.length !== 1 ? 's' : ''}
              </p>
              <ProductGrid products={products} />
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter to find what you're looking for.</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
