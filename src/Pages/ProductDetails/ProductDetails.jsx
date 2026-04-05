import { useParams } from "react-router-dom";
import { useProduct } from "../../Contexts/Product/ProductContext";
import { useEffect, useState } from "react";
import { useCart } from "../../Contexts/Cart/CartContext";
import Cart from "../../Components/Cart/Cart";

const ProductDetails = () => {
  const { id } = useParams();
  const { filteredProducts } = useProduct();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showQuantitySelector, setShowQuantitySelector] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const found = filteredProducts.find((p) => p._id === id);
    setProduct(found);
  }, [id, filteredProducts]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setShowQuantitySelector(false);
    setQuantity(1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (!product) return <p className="p-10">Produto não encontrado...</p>;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        {/* IMAGEM */}
        <div className="bg-[#F1E8E2] p-6 rounded-2xl">
          <img
            src={product.image || "/images/default-perfume.jpg"}
            alt={product.name}
            className="w-full object-contain"
          />
        </div>

        {/* INFO */}
        <div>
          <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <p className="text-lg text-[#5B2333] font-semibold mb-6">
            R$ {product.price.toFixed(2)}
          </p>

          <p className="text-gray-700 mb-6 leading-relaxed">
            {product.description}
          </p>

          {/* QUANTIDADE */}
          {showQuantitySelector ? (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-[#F1E8E2] rounded-full"
                >
                  -
                </button>

                <span className="w-12 text-center font-semibold text-lg">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock, quantity + 1))
                  }
                  className="w-10 h-10 bg-[#F1E8E2] rounded-full"
                >
                  +
                </button>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowQuantitySelector(false)}
                  className="flex-1 border py-2 rounded-full"
                >
                  Cancelar
                </button>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-[#C6A75E] py-2 rounded-full"
                >
                  Confirmar
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowQuantitySelector(true)}
              className={`w-full py-3 rounded-full ${
                isAdded
                  ? "bg-[#5B2333] text-[#F5E6D3]"
                  : "bg-[#C6A75E] hover:bg-[#B8954D] text-[#1C1C1C]"
              }`}
            >
              {isAdded ? "✓ Adicionado" : "Adicionar à Sacola"}
            </button>
          )}
        </div>
      </div>
      <Cart />
    </div>
  );
};

export default ProductDetails;
