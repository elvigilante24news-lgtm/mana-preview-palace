import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Minus, Plus, Store, Truck, Heart, Wheat } from 'lucide-react';
import { useStore } from '@/store';
import { categoryLabels } from '@/types';
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
  const [isFavorite, setIsFavorite] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen pt-24 pb-24 lg:pb-12 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-2">Producto no encontrado</h1>
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
    <div className="min-h-screen pt-20 pb-28 lg:pb-12 bg-mana-cream">
      {/* Back button */}
      <div className="container-app section-padding pt-4 pb-2">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
      </div>

      {/* Product Image - centered like reference */}
      <div className="flex justify-center px-6 mb-6">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover rounded-full shadow-xl"
          />
          {!product.hasGluten && (
            <span className="absolute top-2 left-2 gluten-free-badge px-2 py-1 text-xs rounded-full">
              <Wheat className="w-3 h-3 inline mr-1" />
              Sin Gluten
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-2 right-2 px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium">
              ¡Últimas!
            </span>
          )}
        </div>
      </div>

      {/* Product Info Card */}
      <div className="container-app section-padding">
        <div className="bg-white rounded-3xl shadow-card p-6 space-y-5">
          {/* Title + Favorite */}
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-bold text-foreground">{product.title}</h1>
              <p className="text-sm text-muted-foreground mt-0.5">{categoryLabels[product.category]}</p>
            </div>
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className="mt-1 flex-shrink-0"
            >
              <Heart
                className={`w-6 h-6 transition-colors ${
                  isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-300'
                }`}
              />
            </button>
          </div>

          {/* Quantity selector + Price */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-gray-100 rounded-full p-1">
              <button
                onClick={() => {
                  if (weightUnit === 'unidad') setQuantity(Math.max(1, quantity - 1));
                  else if (weightUnit === 'kg') setWeightValue(Math.max(0.25, weightValue - 0.25));
                  else setWeightValue(Math.max(50, weightValue - 50));
                }}
                className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-600" />
              </button>
              <span className="w-8 text-center font-semibold text-foreground">
                {weightUnit === 'unidad' ? quantity : weightValue}
              </span>
              <button
                onClick={() => {
                  if (weightUnit === 'unidad') setQuantity(Math.min(product.stock, quantity + 1));
                  else if (weightUnit === 'kg') setWeightValue(weightValue + 0.25);
                  else setWeightValue(weightValue + 50);
                }}
                className="w-9 h-9 rounded-full bg-mana-green shadow-sm flex items-center justify-center hover:bg-mana-green-dark transition-colors"
              >
                <Plus className="w-4 h-4 text-white" />
              </button>
            </div>
            <span className="font-heading text-2xl font-bold text-mana-green">
              ${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>

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
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  weightUnit === unit
                    ? 'bg-mana-green text-white'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {unit === 'unidad' ? 'Unidades' : unit.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold text-foreground text-sm mb-1">Descripción</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {/* Features as tags */}
          {product.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {product.features.map((feat, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-mana-cream rounded-full text-xs text-gray-600 font-medium">
                  {feat}
                </span>
              ))}
            </div>
          )}

          {/* Delivery Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-foreground text-sm">Disponibilidad</h3>
            {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'pickup_only') && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-mana-green/10 rounded-full flex items-center justify-center">
                  <Store className="w-4 h-4 text-mana-green" />
                </div>
                <span className="text-gray-600">Retiro en local</span>
              </div>
            )}
            {(product.deliveryAvailability === 'both' || product.deliveryAvailability === 'delivery_only') && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-mana-burgundy/10 rounded-full flex items-center justify-center">
                  <Truck className="w-4 h-4 text-mana-burgundy" />
                </div>
                <span className="text-gray-600">Envío a domicilio</span>
              </div>
            )}
            {product.deliveryAvailability === 'pickup_only' && (
              <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg">
                ⚠ Solo disponible para retiro en el local
              </p>
            )}
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

          {/* Add to Cart - full width green button like reference */}
          <AddToCartButton
            product={product}
            quantity={effectiveQuantity}
            variant="full"
            className="w-full py-4 text-base rounded-2xl"
            label={`Agregar al Carrito ($${totalPrice.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })})`}
          />
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-8">
            <h2 className="font-heading text-xl font-bold text-foreground mb-4">Productos Relacionados</h2>
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
                    <h3 className="font-heading font-semibold text-sm text-foreground truncate">{rp.title}</h3>
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
