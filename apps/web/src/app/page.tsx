import { Suspense } from 'react';
import { MapView } from '@/components/map/map-view';
import { SearchBar } from '@/components/search/search-bar';
import { CategoryGrid } from '@/components/categories/category-grid';
import { FeaturedBusinesses } from '@/components/business/featured-businesses';
import { Card, CardContent } from '@cozumel/ui';
import { Skeleton } from '@cozumel/ui';

function MapSkeleton() {
  return (
    <Card className="h-[400px] md:h-[500px]">
      <CardContent className="p-0">
        <Skeleton className="w-full h-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative py-12 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 caribbean-gradient opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-caribbean-600 to-coral-500 bg-clip-text text-transparent">
            Descubre Cozumel
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Tu marketplace local para negocios y turistas. Encuentra, reserva y conecta con servicios locales.
          </p>
          
          <SearchBar className="mb-8" />
        </div>
      </section>

      {/* Map Section */}
      <section className="container">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Explora el Mapa</h2>
            <p className="text-muted-foreground">Descubre negocios cerca de ti</p>
          </div>
        </div>
        
        <Suspense fallback={<MapSkeleton />}>
          <MapView />
        </Suspense>
      </section>

      {/* Categories */}
      <section className="container">
        <h2 className="text-3xl font-bold mb-8 text-center">Categorías Populares</h2>
        <CategoryGrid />
      </section>

      {/* Featured Businesses */}
      <section className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Negocios Destacados</h2>
            <p className="text-muted-foreground">Los mejores lugares verificados</p>
          </div>
        </div>
        
        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[4/3] w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        }>
          <FeaturedBusinesses />
        </Suspense>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/30 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un negocio?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Únete a nuestra plataforma y llega a más clientes. Verificación rápida y herramientas poderosas para hacer crecer tu negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-caribbean-500 text-white rounded-lg font-semibold hover:bg-caribbean-600 transition-colors">
              Registrar Negocio
            </button>
            <button className="px-8 py-3 border border-caribbean-500 text-caribbean-600 rounded-lg font-semibold hover:bg-caribbean-50 transition-colors">
              Saber Más
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}