import {
  Scale,
  FileText,
  Users,
  BookOpen,
  AlertTriangle,
  Phone,
  Heart,
  Users2,
  Megaphone,
  Shield,
  Target,
  Plane,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
  BarChart3,
} from 'lucide-react'

export type IconName = 
  | 'Scale'
  | 'FileText'
  | 'Users'
  | 'BookOpen'
  | 'AlertTriangle'
  | 'Phone'
  | 'Heart'
  | 'Users2'
  | 'Megaphone'
  | 'Shield'
  | 'Target'
  | 'Plane'
  | 'Mail'
  | 'MapPin'
  | 'Menu'
  | 'X'
  | 'ChevronLeft'
  | 'ChevronRight'
  | 'ArrowRight'
  | 'Facebook'
  | 'Linkedin'
  | 'Twitter'
  | 'BarChart3'

const iconMap: Record<IconName, React.ComponentType<{ className?: string }>> = {
  Scale,
  FileText,
  Users,
  BookOpen,
  AlertTriangle,
  Phone,
  Heart,
  Users2,
  Megaphone,
  Shield,
  Target,
  Plane,
  Mail,
  MapPin,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Facebook,
  Linkedin,
  Twitter,
  BarChart3,
}

export function getIcon(iconName: string | null | undefined) {
  if (!iconName || !iconMap[iconName as IconName]) {
    return iconMap.Shield // default fallback icon
  }
  return iconMap[iconName as IconName]
}

export function getAllIcons() {
  return Object.keys(iconMap)
}
