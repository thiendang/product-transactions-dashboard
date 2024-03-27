import { TabsProps } from "@mui/material";

export interface Product {
  product: string;
  transactions: number;
  dollarValue: number;
  quantity: number;
  containers: number;
  weight: number;
}

export interface HeadChart {
  id: number;
  value: keyof Product;
  label: string;
}

export interface HeadCell {
  disablePadding: boolean;
  id: keyof Product;
  label: string;
  numeric: boolean;
}

export type Order = 'asc' | 'desc';

export interface EnhancedTableProps {
  numSelected?: number;
  onRequestSort: (
    event: React.MouseEvent<unknown>,
    property: keyof Product
  ) => void;
  // onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

export interface StyledTabsProps extends TabsProps {
  children?: React.ReactNode;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

export interface StyledTabProps {
  label: string;
}