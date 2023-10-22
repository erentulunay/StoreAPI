import ProductList from "./ProductList";
import {  useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponents";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFilters, fetchProductsAsync, productSelectors,  setPageNumber,  setProductParams } from "./catalogSlice";
import {  Grid, Paper } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";


const sortOptions = [
  {value: 'name', name: 'Alphabetical'},
  {value: 'priceDesc', name: 'Price - High to low'},
  {value: 'price', name: 'Price - Low to High'}
]

export default function Catalog() {
  const products = useAppSelector(productSelectors.selectAll);
  const {productsLoaded,status,filtersLoaded,brands,types,productParams,metaData} = useAppSelector(state=>state.catalog)
  const dispatch = useAppDispatch();

  useEffect(() => {
    if(!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded,dispatch]);
  
  useEffect(() => {
    if(!filtersLoaded) dispatch(fetchFilters());
  },[dispatch,filtersLoaded])

  if(status.includes('pending') || !metaData) return <LoadingComponent message="Loading products..."/>


  return (
    <Grid container columnSpacing={4}>
      <Grid item xs={3}>
          <Paper sx={{mb:2}}>
            <ProductSearch/>
          </Paper>
          <Paper sx={{mb:2,p:2}}>
              <RadioButtonGroup
              selectedValue={productParams.orderBy}
              options={sortOptions}
              onChange={(e: any) => dispatch(setProductParams({orderBy:e.target.value}))}
              />
          </Paper>
          <Paper sx={{mb:2,p:2}}>
              <CheckboxButtons
                items={brands}
                checked={productParams.brands}
                onChange={(items:string[]) =>dispatch(setProductParams({brands: items}))}
              ></CheckboxButtons>
          </Paper>
          <Paper sx={{mb:2,p:2}}>
            <CheckboxButtons
                items={types}
                checked={productParams.types}
                onChange={(items:string[]) =>dispatch(setProductParams({types: items}))}
                ></CheckboxButtons>
          </Paper>
      </Grid>
      <Grid item xs={9}>
        <ProductList products={products}></ProductList>
      </Grid>
      <Grid item xs ={3}></Grid>
      <Grid item xs ={9} sx={{mb:2}}>
        <AppPagination
        metaData={metaData}
        onPageChange={(page:number) => dispatch(setPageNumber({pageNumber:page}))}
        />
      </Grid>

    </Grid>
  );
}
