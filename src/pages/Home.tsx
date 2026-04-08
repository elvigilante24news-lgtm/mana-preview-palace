import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Star, Clock, MapPin, Phone } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels } from '@/types';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const { products, categories } = useStore();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);

  const featuredProducts = products.slice(0, 8);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-title-line', { y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out', delay: 0.3 });
      gsap.from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out', delay: 0.8 });
      gsap.from('.hero-cta', { scale: 0.9, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(1.7)', delay: 1 });
      gsap.from('.featured-card', { scrollTrigger: { trigger: featuredRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, y: 80, opacity: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      gsap.from('.category-card', { scrollTrigger: { trigger: categoriesRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: 100, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.about-image', { scrollTrigger: { trigger: aboutRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
      gsap.from('.about-content', { scrollTrigger: { trigger: aboutRef.current, start: 'top 80%', toggleActions: 'play none none reverse' }, x: 50, opacity: 0, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1920&h=1080&fit=crop" alt="Panadería" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-mana-cream/95 via-mana-cream/80 to-transparent" />
        </div>
        <div className="container-app section-padding relative z-10">
          <div className="max-w-2xl">
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-mana-green/10 text-mana-green rounded-full text-sm font-medium">
                <Star className="w-4 h-4 fill-current" />
                Desde 1985 en Posadas, Misiones
              </span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6">
              <span className="hero-title-line block">El origen del</span>
              <span className="hero-title-line block text-mana-green">sabor artesanal</span>
            </h1>
            <p className="hero-subtitle text-lg sm:text-xl text-gray-600 mb-8 max-w-lg">
              Panadería Maná - Horneando tradición con los mejores ingredientes locales. Cada producto cuenta una historia de dedicación y pasión.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/productos" className="hero-cta btn-primary inline-flex items-center gap-2">Ver Productos <ArrowRight className="w-5 h-5" /></Link>
              <Link to="/nosotros" className="hero-cta btn-secondary inline-flex items-center gap-2">Conocer Más</Link>
            </div>
            <div className="mt-12 flex flex-wrap gap-6 sm:gap-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-mana-green/10 rounded-xl flex items-center justify-center"><Clock className="w-6 h-6 text-mana-green" /></div>
                <div><p className="text-sm text-gray-500">Horario</p><p className="font-medium text-gray-900">Lun-Sáb 6:00-20:00</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-mana-burgundy/10 rounded-xl flex items-center justify-center"><MapPin className="w-6 h-6 text-mana-burgundy" /></div>
                <div><p className="text-sm text-gray-500">Ubicación</p><p className="font-medium text-gray-900">Av. Lavalle 1234</p></div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-mana-cream to-transparent" />
      </section>

      {/* Featured Products */}
      <section ref={featuredRef} className="py-20">
        <div className="container-app section-padding">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
            <div>
              <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">Destacados</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Nuestros Favoritos</h2>
              <p className="text-gray-600 mt-2">Los productos más amados por nuestros clientes</p>
            </div>
            <Link to="/productos" className="inline-flex items-center gap-2 text-mana-green font-medium hover:text-mana-burgundy transition-colors">Ver todos <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <Link key={product.id} to={`/producto/${product.id}`} className="featured-card product-card-3d bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 block">
                <div className="relative aspect-square overflow-hidden">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                  {!product.hasGluten && <span className="absolute top-3 left-3 gluten-free-badge">Sin Gluten</span>}
                  <div className="absolute bottom-3 right-3">
                    <AddToCartButton product={product} variant="icon" />
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-xs text-mana-green font-medium uppercase tracking-wider">{categoryLabels[product.category]}</span>
                  <h3 className="font-heading font-semibold text-lg text-gray-900 mt-1">{product.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1">{product.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="price-tag">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section ref={categoriesRef} className="py-20 bg-white">
        <div className="container-app section-padding">
          <div className="text-center mb-12">
            <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">Explora</span>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Explora por Categoría</h2>
            <p className="text-gray-600 mt-2 max-w-xl mx-auto">Encuentra exactamente lo que buscas en nuestra variedad de productos artesanales</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.slice(0, 6).map((category, index) => {
              const categoryImages: Record<string, string> = { panes: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&h=600&fit=crop', facturas: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&h=600&fit=crop', tortas: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop', sandwiches: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800&h=600&fit=crop', galletas: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&h=600&fit=crop', especialidades: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&h=600&fit=crop' };
              return (
                <Link key={category} to={`/productos?categoria=${category}`} className={`category-card group relative overflow-hidden rounded-2xl aspect-[4/3] ${index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : ''}`}>
                  <img src={categoryImages[category]} alt={categoryLabels[category]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="category-overlay" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                    <h3 className="font-heading text-2xl sm:text-3xl font-bold text-center">{categoryLabels[category]}</h3>
                    <span className="mt-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">Explorar</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section ref={aboutRef} className="py-20">
        <div className="container-app section-padding">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="about-image relative">
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=1000&fit=crop" alt="Panadero trabajando" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-mana-green/10 rounded-2xl -z-10" />
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-mana-burgundy/10 rounded-2xl -z-10" />
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-xl shadow-xl p-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div><p className="font-heading text-2xl sm:text-3xl font-bold text-mana-green">38+</p><p className="text-xs sm:text-sm text-gray-500">Años de trayectoria</p></div>
                  <div><p className="font-heading text-2xl sm:text-3xl font-bold text-mana-burgundy">50+</p><p className="text-xs sm:text-sm text-gray-500">Productos artesanales</p></div>
                  <div><p className="font-heading text-2xl sm:text-3xl font-bold text-mana-green">1000+</p><p className="text-xs sm:text-sm text-gray-500">Clientes felices</p></div>
                </div>
              </div>
            </div>
            <div className="about-content">
              <span className="text-mana-burgundy font-medium text-sm uppercase tracking-wider">Nuestra Historia</span>
              <h2 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900 mt-2">Más de 38 años de tradición</h2>
              <p className="text-gray-600 mt-4 leading-relaxed">Desde 1985, en el corazón de Posadas, Misiones, la familia Maná ha mantenido viva la tradición de la panadería artesanal.</p>
              <p className="text-gray-600 mt-4 leading-relaxed">Nuestro compromiso es simple: ofrecer productos frescos, elaborados con amor y dedicación, manteniendo vivas las recetas que han pasado de generación en generación.</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/nosotros" className="btn-primary inline-flex items-center gap-2">Conocer Nuestra Historia <ArrowRight className="w-5 h-5" /></Link>
                <a href="tel:+543761234567" className="btn-secondary inline-flex items-center gap-2"><Phone className="w-5 h-5" /> Llamar Ahora</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-app section-padding">
          <div className="relative bg-mana-burgundy rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-mana-burgundy to-mana-burgundy-dark" />
            <div className="absolute top-0 right-0 w-1/2 h-full bg-mana-green/20 skew-x-12 transform origin-top-right" />
            <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
              <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">¿Listo para disfrutar?</h2>
              <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">Haz tu pedido ahora y recoge en tienda, o disfruta de nuestro servicio a domicilio en Posadas.</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/productos" className="px-8 py-4 bg-white text-mana-burgundy rounded-xl font-semibold hover:bg-mana-cream transition-colors inline-flex items-center gap-2">Hacer Pedido <ArrowRight className="w-5 h-5" /></Link>
                <Link to="/productos" className="px-8 py-4 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">Ver Menú Completo</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
