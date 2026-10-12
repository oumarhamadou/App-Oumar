import {
  BookOpen,
  Cpu,
  GraduationCap,
  LayoutDashboard,
  Library,
  Newspaper,
  Settings,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  short: string;
  icon: LucideIcon;
}

export const NAV_PRIMARY: NavItem[] = [
  { href: "/", label: "Tableau de bord", short: "Accueil", icon: LayoutDashboard },
  { href: "/actualites", label: "Actualités", short: "Actus", icon: Newspaper },
  { href: "/assistant", label: "Assistant IA", short: "Assistant", icon: Sparkles },
  { href: "/ia", label: "Espace IA", short: "IA", icon: Cpu },
  { href: "/savoir", label: "Savoir", short: "Savoir", icon: BookOpen },
  { href: "/apprendre", label: "Apprendre", short: "Apprendre", icon: GraduationCap },
];

export const NAV_SECONDARY: NavItem[] = [
  { href: "/bibliotheque", label: "Ma bibliothèque", short: "Biblio", icon: Library },
  { href: "/parametres", label: "Paramètres", short: "Réglages", icon: Settings },
];

export const NAV_MOBILE: NavItem[] = [NAV_PRIMARY[0], NAV_PRIMARY[1], NAV_PRIMARY[2], NAV_PRIMARY[4], NAV_PRIMARY[5]];

export function isActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
