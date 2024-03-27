import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import ProductTable from './components/ProductTable';
import {productData, productTransactionsChart} from './data/products';
import ProductTransactionsChart from './components/ProductTransactionsChart';
import FilterProduct from './components/FilterProduct';
import ProductVolumByCountry from './components/ProductVolumByCountry';

const App: React.FC = () => {
  const [filteredProducts, setFilteredProducts] = useState([...productData]);

  const handleFilterChange = (productName: string) => {
    if (!productName.length) {
      setFilteredProducts([...productData]);
    } else {
      setFilteredProducts([
        ...productData.filter((product) =>
          product.product.toLowerCase().includes(productName.toLowerCase())
        ),
      ]);
    }
  };

  return (
    <Container maxWidth="xl" style={{ padding: 24 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ProductTransactionsChart productData={productTransactionsChart} />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProductVolumByCountry productData={productTransactionsChart} />
        </Grid>
        <Grid item xs={12}>
          <FilterProduct onSearch={handleFilterChange} />
        </Grid>
        <Grid item xs={12}>
          <ProductTable productData={filteredProducts} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
