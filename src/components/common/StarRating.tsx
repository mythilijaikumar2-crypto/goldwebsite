import React from 'react';
import { Star, StarHalf } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5 text-gold-primary">
      {Array.from({ length: fullStars }).map((_, i) => (
        <Star key={`f-${i}`} size={size} className="fill-gold-primary stroke-gold-primary" />
      ))}
      {hasHalf && (
        <StarHalf key="half" size={size} className="fill-gold-primary stroke-gold-primary" />
      )}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Star key={`e-${i}`} size={size} className="text-neutral-700 stroke-neutral-700" />
      ))}
    </div>
  );
};
export default StarRating;
