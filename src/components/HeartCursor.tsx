
import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

const HeartCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isBeating, setIsBeating] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setVisible(true);
      setIsBeating(true);
      
      // Reset beating animation after a short delay
      setTimeout(() => {
        setIsBeating(false);
      }, 300);
    };

    const onMouseLeave = () => {
      setVisible(false);
    };

    window.addEventListener('mousemove', updatePosition);
    document.body.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      document.body.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      className="custom-cursor"
      style={{ 
        transform: `translate(${position.x - 12}px, ${position.y - 12}px)` 
      }}
    >
      <Heart 
        className={`text-pink-500 ${isBeating ? 'animate-heart-beat' : ''}`} 
        size={24} 
        fill="#FFDEE2" 
      />
    </div>
  );
};

export default HeartCursor;
