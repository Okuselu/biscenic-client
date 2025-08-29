import React, { useState } from 'react';
import { ProductImage } from '../../types/product.types';
import './ProductImages.css';

interface ProductImagesProps {
  images: ProductImage[];
}

const ProductImages: React.FC<ProductImagesProps> = ({ images }) => {
  const [mainImage, setMainImage] = useState(
    images.find(img => img.isMain)?.url || images[0]?.url
  );

  return (
    <div className="product-images">
      <div className="main-image">
        <img 
          src={mainImage} 
          alt="Product" 
          onError={(e) => {
            e.currentTarget.src = "/images/placeholder-image.jpg";
          }}
        />
      </div>
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`thumbnail ${image.url === mainImage ? 'active' : ''}`}
            onClick={() => setMainImage(image.url)}
          >
            <img 
              src={image.url} 
              alt={`Product thumbnail ${index + 1}`}
              onError={(e) => {
                e.currentTarget.src = "/images/placeholder-image.jpg";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImages;