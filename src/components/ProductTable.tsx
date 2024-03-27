import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { visuallyHidden } from '@mui/utils';
import { EnhancedTableProps, HeadCell, Order, Product } from '../types';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    textAlign: 'center',
    border: '1px solid #8D93A1',
    fontWeight: 600,
  },
  [`&.${tableCellClasses.head}:first-of-type`]: {
    minWidth: '200px',
  },
  [`&.${tableCellClasses.body}:first-of-type`]: {
    textAlign: 'left',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    textAlign: 'center',
    border: '1px solid rgba(224, 224, 224, 1)',
    backgroundColor: theme.palette.common.white,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  '&.MuiTableSortLabel-root': {
    color: 'white',
  },
  '&.MuiTableSortLabel-root:hover': {
    color: 'white',
  },
  '&.Mui-active': {
    color: 'white',
  },
  '& .MuiTableSortLabel-icon': {
    color: 'white !important',
  },
}));

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells: readonly HeadCell[] = [
  {
    id: 'product',
    numeric: false,
    disablePadding: false,
    label: 'Product',
  },
  {
    id: 'transactions',
    numeric: false,
    disablePadding: false,
    label: 'Transactions',
  },
  {
    id: 'dollarValue',
    numeric: false,
    disablePadding: false,
    label: 'US Dollar Value',
  },
  {
    id: 'quantity',
    numeric: false,
    disablePadding: false,
    label: 'Quantity',
  },
  {
    id: 'containers',
    numeric: false,
    disablePadding: false,
    label: 'Containers',
  },
  {
    id: 'weight',
    numeric: false,
    disablePadding: false,
    label: 'Weight',
  },
];

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler =
    (property: keyof Product) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <StyledTableRow>
        {headCells.map((headCell) => (
          <StyledTableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <StyledTableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </StyledTableSortLabel>
          </StyledTableCell>
        ))}
      </StyledTableRow>
    </TableHead>
  );
}

function ProductTable({ productData }: { productData: Product[] }) {

  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Product>('transactions');
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleRequestSort = (
    event: React.MouseEvent<unknown>,
    property: keyof Product
  ) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - productData.length) : 0;

  const visibleRows = stableSort(
    productData,
    getComparator(order, orderBy)
  ).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Card>
      <CardContent>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={'medium'}
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              // onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={productData.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                // const isItemSelected = isSelected(row.id);
                // const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <StyledTableRow key={`${row.product} - ${row.transactions}`}>
                    <StyledTableCell align="left">
                      {row.product}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.transactions}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.dollarValue}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.quantity}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.containers}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.weight}
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
              {emptyRows > 0 && (
                <StyledTableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <StyledTableCell colSpan={6} />
                </StyledTableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={productData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
}

export default ProductTable;
