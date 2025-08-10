import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export default function MobileSwipeBack() {
  const navigate = useNavigate();
  const location = useLocation();

  const startX = useRef(0);
  const startY = useRef(0);
  const tracking = useRef(false);
  const triggered = useRef(false);

  useEffect(() => {
    function onTouchStart(e: TouchEvent) {
      if (!e.touches || e.touches.length === 0) return;
      const t = e.touches[0];
      // só inicia se começar da borda esquerda (gesto de voltar)
      if (t.clientX <= 20) {
        startX.current = t.clientX;
        startY.current = t.clientY;
        tracking.current = true;
        triggered.current = false;
      }
    }

    function onTouchMove(e: TouchEvent) {
      if (!tracking.current) return;
      const t = e.touches[0];
      const dx = t.clientX - startX.current;
      const dy = t.clientY - startY.current;
      // Evita acionar em scroll vertical predominante
      if (Math.abs(dy) > Math.abs(dx)) return;
      // Threshold para considerar swipe de voltar
      if (dx > 90 && Math.abs(dy) < 60) {
        triggered.current = true;
      }
    }

    function onTouchEnd() {
      if (tracking.current && triggered.current) {
        // Evita voltar da Home (opcional)
        if (location.pathname !== '/') {
          navigate(-1);
        }
      }
      tracking.current = false;
      triggered.current = false;
    }

    if ('ontouchstart' in window) {
      document.addEventListener('touchstart', onTouchStart, { passive: true });
      document.addEventListener('touchmove', onTouchMove, { passive: true });
      document.addEventListener('touchend', onTouchEnd, { passive: true });
    }
    return () => {
      document.removeEventListener('touchstart', onTouchStart as any);
      document.removeEventListener('touchmove', onTouchMove as any);
      document.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [navigate, location.pathname]);

  return null;
}
