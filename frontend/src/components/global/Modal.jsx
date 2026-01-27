// src/components/global/Modal.jsx
import {
  Modal as HeroModal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

export default function Modal({
  isOpen,
  onOpenChange,
  title,
  children,
  footerButtons = [],
}) {
  return (
    <HeroModal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            {title && <ModalHeader>{title}</ModalHeader>}
            <ModalBody>{children}</ModalBody>
            {footerButtons.length > 0 && (
              <ModalFooter>
                {footerButtons.map((btn, i) => (
                  <Button key={i} {...btn.props} onPress={btn.onPress || onClose}>
                    {btn.label}
                  </Button>
                ))}
              </ModalFooter>
            )}
          </>
        )}
      </ModalContent>
    </HeroModal>
  );
}