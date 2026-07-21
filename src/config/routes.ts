import type { LucideIcon } from 'lucide-react';
import { Home, Compass, Users, LayoutGrid, ShoppingBag, Store, MessageCircle, Bell, UserCircle, PlusCircle } from 'lucide-react';

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  implemented: boolean;
};

/** Desktop left sidebar navigation. */
export const primaryNav: NavItem[] = [
  { label: 'Início', href: '/home', icon: Home, implemented: true },
  { label: 'Explorar', href: '/explore', icon: Compass, implemented: false },
  { label: 'Pessoas', href: '/people', icon: Users, implemented: false },
  { label: 'Comunidades', href: '/communities', icon: LayoutGrid, implemented: false },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag, implemented: false },
  { label: 'Lojas', href: '/shops', icon: Store, implemented: false },
  { label: 'Mensagens', href: '/messages', icon: MessageCircle, implemented: false },
  { label: 'Notificações', href: '/notifications', icon: Bell, implemented: false },
  { label: 'Perfil', href: '/profile', icon: UserCircle, implemented: true },
];

/** Mobile bottom navigation. */
export const mobileNav: NavItem[] = [
  { label: 'Início', href: '/home', icon: Home, implemented: true },
  { label: 'Explorar', href: '/explore', icon: Compass, implemented: false },
  { label: 'Criar', href: '/create', icon: PlusCircle, implemented: false },
  { label: 'Marketplace', href: '/marketplace', icon: ShoppingBag, implemented: false },
  { label: 'Perfil', href: '/profile', icon: UserCircle, implemented: true },
];
