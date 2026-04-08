import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Store, Truck, ShoppingCart, Star, Package, Wheat } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels, deliveryAvailabilityLabels } from '@/types';
import { AddToCartButton } from '@/components/ui/AddToCartButton';

type WeightUnit = 'unidad' | 'kg' | 'g';

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products } = useStore();
  
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);
  
  const [quantity, setQuantity] = useState(1);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('unidad');
  const [weightValue, setWeightValue] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-heading text-2xl font-bold text-gray-900 mb-2">Producto no encontrado</h1>
          <Link to="/productos" className="btn-primary inline-flex items-center gap-2 mt-4">
            <ArrowLeft className="w-5 h-5" /> Ver Productos
          </Link>
        </div>
      </div>
    );
  }

  const effectiveQuantity = weightUnit === 'unidad' ? quantity : 1;
  const priceMultiplier = weightUnit === 'kg' ? weightValue : weightUnit === 'g' ? weightValue / 1000 : quantity;
  const totalPrice = product.price * priceMultiplier;

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen pt-24 pb-24 lg:pb-12">
      <div className="container-app section-padding">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-mana-green transition-colors">Inicio</Link>
          <span>/</span>
          <Link to="/productos" className="hover:text-mana-green transition-colors">Productos</Link>
          <span>/</span>
          <Link to={`/productos?categoria=${product.category}`} className="hover:text-mana-green transition-colors">
            {categoryLabels[product.category]}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white shadow-card">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              {!product.hasGluten && (
                <span className="absolute top-4 left-4 gluten-free-badge px-3 py-1.5 text-sm">
                  <Wheat className="w-4 h-4 inline mr-1" />
                  Sin Gluten
                </span>
              )}
              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-4 right-4 px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                  ¡Últimas unidades!
                </span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      selectedImage === idx ? 'border-mana-green shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.title} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Title */}
            <div>
              <span className="inline-block px-3 py-1 bg-mana-green/10 text-mana-green rounded-full text-xs font-medium uppercase tracking-wider mb-3">
                {categoryLabels[product.category]}
              </span>
              <h1 className="font-heading text-3xl sm:text-4xl font-bold text-gray-900">
                {product.title}
              </h1>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-mana-burgundy">
                ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              {weightUnit !== 'unidad' && (
                <span className="text-gray-500 text-sm">
                  (${product.price.toLocaleString()}/kg)
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed text-base">
              {product.description}
            </p>

            {/* Features */}
            {product.features.length > 0 && (
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {product.features.map((feat, idx) => (
                    <span key={idx} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-mana-cream rounded-full text-sm text-gray-700">
                      <Star className="w-3 h-3 text-mana-green fill-mana-green" />
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Info */}
            <div className="bg-mana-cream rounded-2xl p-5 space-y-3">
              <h3 className="font-medium text-gray-900 text-sm uppercase tracking-wider">Disponibilidad de entrega</h3>
              <div className="flex flex-col gap-2">
                {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'pickup_only') && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-mana-green/10 rounded-lg flex items-center justify-center">
                      <Store className="w-4 h-4 text-mana-green" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Retiro en local</p>
                      <p className="text-gray-500 text-xs">Av. Lavalle 1234, Posadas</p>
                    </div>
                  </div>
                )}
                {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'delivery_only') && (
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-mana-burgundy/10 rounded-lg flex items-center justify-center">
                      <Truck className="w-4 h-4 text-mana-burgundy" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Envío a domicilio</p>
                      <p className="text-gray-500 text-xs">Posadas y alrededores</p>
                    </div>
                  </div>
                )}
                {product.deliveryAvailability === 'pickup_only' && (
                  <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                    ⚠ Este producto solo está disponible para retiro en el local
                  </p>
                )}
              </div>
            </div>

            {/* Weight / Quantity Selector */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Cantidad</h3>
              
              {/* Unit selector */}
              <div className="flex gap-2">
                {(['unidad', 'kg', 'g'] as WeightUnit[]).map((unit) => (
                  <button
                    key={unit}
                    onClick={() => {
                      setWeightUnit(unit);
                      if (unit === 'kg') setWeightValue(1);
                      if (unit === 'g') setWeightValue(250);
                      if (unit === 'unidad') setQuantity(1);
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      weightUnit === unit
                        ? 'bg-mana-green text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {unit === 'unidad' ? 'Unidades' : unit.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Quantity controls */}
              {weightUnit === 'unidad' ? (
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">{product.stock} disponibles</span>
                </div>
              ) : weightUnit === 'kg' ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() => setWeightValue(Math.max(0.25, weightValue - 0.25))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-16 text-center font-semibold text-lg">{weightValue}</span>
                      <button
                        onClick={() => setWeightValue(weightValue + 0.25)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">kg</span>
                  </div>
                  <div className="flex gap-2">
                    {[0.25, 0.5, 1, 2].map((v) => (
                      <button
                        key={v}
                        onClick={() => setWeightValue(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          weightValue === v ? 'bg-mana-green/10 text-mana-green border border-mana-green' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {v} kg
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 bg-white border-2 border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() => setWeightValue(Math.max(50, weightValue - 50))}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-16 text-center font-semibold text-lg">{weightValue}</span>
                      <button
                        onClick={() => setWeightValue(weightValue + 50)}
                        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500">gramos</span>
                  </div>
                  <div className="flex gap-2">
                    {[100, 250, 500, 750].map((v) => (
                      <button
                        key={v}
                        onClick={() => setWeightValue(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                          weightValue === v ? 'bg-mana-green/10 text-mana-green border border-mana-green' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {v}g
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex gap-3 pt-2">
              <AddToCartButton
                product={product}
                quantity={effectiveQuantity}
                variant="full"
                className="flex-1 py-4 text-lg"
              />
            </div>

            {/* Gluten info */}
            <div className="flex items-center gap-2 text-sm">
              {product.hasGluten ? (
                <span className="contains-gluten-badge">
                  <Wheat className="w-3 h-3" /> Contiene gluten
                </span>
              ) : (
                <span className="gluten-free-badge">
                  <Wheat className="w-3 h-3" /> Sin gluten
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <Link
                  key={rp.id}
                  to={`/producto/${rp.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img src={rp.images[0]} alt={rp.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-heading font-semibold text-sm text-gray-900 truncate">{rp.title}</h3>
                    <span className="price-tag text-base">${rp.price.toLocaleString()}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
