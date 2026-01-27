// src/components/global/Table.jsx
import {
  Table as HeroTable,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";

export default function Table({ columns, rows }) {
  return (
    <HeroTable aria-label="Tabla dinámica">
      <TableHeader>
        {columns.map((col) => (
          <TableColumn key={col.key}>{col.label}</TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {columns.map((col) => (
              <TableCell key={col.key}>{row[col.key]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </HeroTable>
  );
}