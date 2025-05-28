import React, { useState, useEffect } from "react";

// Componente para la barra de progreso
function ProgressBar({ statValue, maxStat }) {
  // Inicialmente el ancho es 0%
  const [width, setWidth] = useState(0);
  // Calculamos el porcentaje con base en el stat y el máximo de referencia
  const percentage = Math.min((statValue / maxStat) * 100, 100);

  useEffect(() => {
    // Usar un pequeño retardo para que se monte primero con 0% y luego se actualice al porcentaje real
    const timer = setTimeout(() => {
      setWidth(percentage);
    }, 50); // 50ms de delay
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div className="bg-blue-500 h-4 rounded transition-all duration-1000 ease-in-out" style={{ width: `${width}%` }}></div>
    </div>
  );
}

export default ProgressBar;
