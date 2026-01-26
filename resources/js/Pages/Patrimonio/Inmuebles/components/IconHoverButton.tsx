import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/Components/ui/button'; 

interface AnimatedIconButtonProps {
  icon: LucideIcon;
  text: string;
  onClick?: () => void;
  variant?: 'ghost' | 'default' | 'outline' | 'secondary' | 'destructive' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  width?: string;
}

export const AnimatedIconButton = ({ 
  icon: Icon, 
  text, 
  onClick,
  variant = 'outline',
  size = 'sm',
  className = '',
  width = 'w-40' // Ancho fijo por defecto
}: AnimatedIconButtonProps) => {
  return (
    <Button    
      variant={variant}       
      size={size}
      className={` mb-2 text-stone-50 hover:bg-green-600 hover:text-stone-50 ${width} ${className}`}
      onClick={onClick}
    >
      <motion.div
        className="relative w-full h-full flex items-center justify-center"
        initial="rest"
        whileHover="hover"
        animate="rest"
      >
        {/* Icono que se desvanece en hover */}
        <motion.div
          variants={{
            rest: { opacity: 1, scale: 1 },
            hover: { opacity: 0, scale: 0.8 }
          }}
          transition={{ duration: 0.2 }}
          className="absolute"
        >
          <Icon className="h-4 w-4" />
        </motion.div>
        
        {/* Texto que aparece en hover */}
        <motion.span
          variants={{
            rest: { opacity: 0, scale: 0.8 },
            hover: { opacity: 1, scale: 1 }
          }}
          transition={{ duration: 0.2 }}
          className="whitespace-nowrap absolute"
        >
          {text}
        </motion.span>
      </motion.div>
    </Button>
  );
};