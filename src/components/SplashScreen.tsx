
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 300); // Délai pour l'animation de sortie
    }, 3500); // 3.5 secondes d'affichage

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center z-50 animate-fade-out">
        <img 
          src="/lovable-uploads/a4476272-e2f6-4a5d-9596-afbf23005688.png" 
          alt="Dictionnaire Nzébi-Français" 
          className="max-w-full max-h-full object-contain animate-scale-out"
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-yellow-600 to-orange-700 flex items-center justify-center z-50 animate-fade-in">
      <img 
        src="/lovable-uploads/a4476272-e2f6-4a5d-9596-afbf23005688.png" 
        alt="Dictionnaire Nzébi-Français" 
        className="max-w-full max-h-full object-contain animate-scale-in"
      />
    </div>
  );
};

export default SplashScreen;
