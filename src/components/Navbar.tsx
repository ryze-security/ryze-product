
import React from 'react';
import { Home, User, Users, Shield, Laptop } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  return (
    <div className="w-full px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md rounded-full px-2 py-1 border border-white/10">
        <NavItem to="/" icon={<Home className="h-5 w-5" />} text="Home" isActive={path === '/'} />
        <NavItem to="/organizational" icon={<Shield className="h-5 w-5" />} text="Organizational" isActive={path.includes('organizational')} />
        <NavItem to="/people" icon={<Users className="h-5 w-5" />} text="People" isActive={path.includes('people')} />
        <NavItem to="/physical" icon={<User className="h-5 w-5" />} text="Physical" isActive={path.includes('physical')} />
        <NavItem to="/technological" icon={<Laptop className="h-5 w-5" />} text="Technological" isActive={path.includes('technological')} />
      </div>
      
      <div className="flex items-center space-x-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2 border border-white/10">
        <span className="text-white">Aditya</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/lovable-uploads/3f9be3b9-69fc-4df2-a320-08881cab4ed0.png" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
}

const NavItem = ({ to, icon, text, isActive }: NavItemProps) => {
  return (
    <Link to={to}>
      <Button 
        variant="ghost" 
        className={`flex items-center space-x-2 rounded-full ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
        size="sm"
      >
        {icon}
        <span>{text}</span>
      </Button>
    </Link>
  );
};

export default Navbar;
