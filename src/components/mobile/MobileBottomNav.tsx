
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Gamepad, ShoppingBag, User, MoreHorizontal } from 'lucide-react';

const MobileBottomNav = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { 
      title: 'Home', 
      path: '/', 
      icon: Home, 
      color: 'text-blue-500',
      activeColor: 'text-blue-600 bg-blue-50'
    },
    { 
      title: 'Games', 
      path: '/games', 
      icon: Gamepad, 
      color: 'text-purple-500',
      activeColor: 'text-purple-600 bg-purple-50'
    },
    { 
      title: 'Shop', 
      path: '/shop', 
      icon: ShoppingBag, 
      color: 'text-green-500',
      activeColor: 'text-green-600 bg-green-50'
    },
    { 
      title: 'Profile', 
      path: '/children', 
      icon: User, 
      color: 'text-orange-500',
      activeColor: 'text-orange-600 bg-orange-50'
    },
    { 
      title: 'More', 
      path: '/settings', 
      icon: MoreHorizontal, 
      color: 'text-gray-500',
      activeColor: 'text-gray-600 bg-gray-50'
    }
  ];

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/' || currentPath === '/dashboard';
    return currentPath.startsWith(path);
  };

  return (
    <div className="mobile-nav">
      <div className="flex items-center justify-around h-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <NavLink
              key={item.title}
              to={item.path === '/' ? '/' : item.path}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all duration-200 ${
                active 
                  ? item.activeColor + ' shadow-md' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 mb-1 ${active ? 'scale-110' : ''} transition-transform duration-200`} />
              <span className={`text-xs font-medium ${active ? 'font-bold' : ''}`}>
                {item.title}
              </span>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
};

export default MobileBottomNav;
