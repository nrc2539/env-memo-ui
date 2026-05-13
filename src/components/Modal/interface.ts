export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  isOpen: boolean;
  onClose?: () => void;
}
