import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav className="flex items-center gap-1.5 py-4 text-xs font-body text-luxury-gray select-none overflow-x-auto whitespace-nowrap">
      <Link 
        to="/" 
        className="flex items-center gap-1 hover:text-gold-primary transition duration-200"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>

      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-600 shrink-0" />
            {isLast || !item.url ? (
              <span className="text-gold-primary font-medium truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.url} 
                className="hover:text-gold-primary transition duration-200 truncate max-w-[200px]"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};
export default Breadcrumbs;
