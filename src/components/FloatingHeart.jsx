import { Star } from 'lucide-react';

export const FloatingHeart = ({ heart }) => {
    const stars = Array.from({ length: 2 }, (_, index) => ({
        id: index,
        x: heart.x + Math.random() * 100 - 50,
        y: heart.y + Math.random() * 100 - 50,
        lifetime: heart.lifetime + Math.random() * 100,
    }));

    return (
        <>
            {stars.map(star => (
                <div
                    key={star.id}
                    className="absolute pointer-events-none animate-float z-[1001]"
                    style={{
                        left: star.x,
                        top: star.y,
                        opacity: 1 - star.lifetime / 80,
                        transform: `translateY(${-star.lifetime / 2}px)`,
                    }}
                >
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
            ))}
        </>
    );
};