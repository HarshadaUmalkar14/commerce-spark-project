
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { 
  fetchFeaturedProducts, 
  fetchNewArrivals, 
  fetchBanners, 
  fetchCategories 
} from '@/services/api';
import ProductGrid from '@/components/ProductGrid';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';

const Home: React.FC = () => {
  const { data: banners, isLoading: isBannersLoading } = useQuery({
    queryKey: ['banners'],
    queryFn: fetchBanners,
  });

  const { data: categories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });

  const { data: featuredProducts, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: fetchFeaturedProducts,
  });

  const { data: newArrivals, isLoading: isNewArrivalsLoading } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: fetchNewArrivals,
  });

  return (
    <div className="container mx-auto px-4">
      {/* Hero Banner Carousel */}
      <section className="mb-10">
        {isBannersLoading ? (
          <div className="w-full h-64 sm:h-80 md:h-96 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {banners?.map((banner) => (
                <CarouselItem key={banner.id}>
                  <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden rounded-lg">
                    <img
                      src={banner.image}
                      alt={banner.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center p-8 text-white">
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">{banner.title}</h2>
                      <p className="text-sm sm:text-base md:text-lg mb-4">{banner.subtitle}</p>
                      <Link to={banner.link}>
                        <Button className="bg-shop-yellow text-shop-text hover:bg-yellow-500">
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        )}
      </section>

      {/* Categories */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Shop by Category</h2>
          <Link to="/products" className="text-shop-blue hover:text-shop-blue-dark flex items-center">
            <span>View all</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {isCategoriesLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories?.map((category) => (
              <Link
                to={`/products?category=${category.name.toLowerCase()}`}
                key={category.id}
                className="relative group overflow-hidden rounded-lg"
              >
                <div className="aspect-square">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                    <h3 className="text-white text-xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products?featured=true" className="text-shop-blue hover:text-shop-blue-dark flex items-center">
            <span>View all</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {isFeaturedLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : featuredProducts?.length ? (
          <ProductGrid products={featuredProducts} />
        ) : (
          <p>No featured products available.</p>
        )}
      </section>

      {/* New Arrivals */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Arrivals</h2>
          <Link to="/products?sort=newest" className="text-shop-blue hover:text-shop-blue-dark flex items-center">
            <span>View all</span>
            <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {isNewArrivalsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : newArrivals?.length ? (
          <ProductGrid products={newArrivals} />
        ) : (
          <p>No new arrivals available.</p>
        )}
      </section>

      {/* Promotion Banner */}
      <section className="mb-12">
        <div className="relative overflow-hidden rounded-lg">
          <div className="bg-shop-blue-dark h-64 md:h-80 flex items-center">
            <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center">
              <div className="text-white text-center md:text-left md:w-1/2 mb-6 md:mb-0">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Special Offer</h2>
                <p className="text-lg mb-6">Get 20% off on your first purchase. Use code <span className="font-bold">FIRST20</span></p>
                <Button className="bg-shop-yellow text-shop-text hover:bg-yellow-500">
                  Shop Now
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center md:justify-end">
                <img 
                  src="https://images.unsplash.com/photo-1567722066597-2bdf36d13481?q=80&w=600&auto=format&fit=crop" 
                  alt="Special offer" 
                  className="h-auto max-h-64 rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
