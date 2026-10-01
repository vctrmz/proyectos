'use client';
import Button from '@/components/ui/Button';
import { useUi } from '@/lib/i18n/LocaleContext';
import { useAbrirContacto } from './ContactDialog';

/* El único «Contactar» de la web: mismo verde, mismo texto y misma acción en
   el menú, la portada, los casos, Sobre mí y el pie. Abre el modal del
   formulario; quien no tiene JavaScript tiene el correo escrito al lado en el
   cierre, en Sobre mí y en el pie. */
export default function ContactButton({ size = 'md', className }: { size?: 'md' | 'lg'; className?: string }) {
  const abrir = useAbrirContacto();
  const ui = useUi();
  return <Button variant="accent" size={size} onClick={abrir} aria-haspopup="dialog" className={className}>{ui.nav.contact}</Button>;
}
