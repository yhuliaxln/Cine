// src/components/global/DropdownMenu.jsx
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";

export default function DropdownMenuComponent({
  triggerButton,
  items = [],
  onAction,
}) {
  return (
    <Dropdown>
      <DropdownTrigger>
        {triggerButton || <Button variant="bordered">Menú</Button>}
      </DropdownTrigger>
      <DropdownMenu aria-label="Menu" onAction={onAction}>
        {items.map((item) => (
          <DropdownItem key={item.key} color={item.color} className={item.className}>
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}