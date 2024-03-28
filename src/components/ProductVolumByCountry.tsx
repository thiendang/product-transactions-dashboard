import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
// import Box from '@mui/material/Box';
// import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
// import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
// import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import { Chart } from 'react-chartjs-2';
import * as ChartGeo from 'chartjs-chart-geo';
import {
  Chart as ChartJS,
  CategoryScale,
  Tooltip,
  Title,
  Legend,
} from 'chart.js';
import { Product, StyledTabProps, StyledTabsProps } from '../types';
import externalTooltip from './chart/customTooltip';
import { headCharts } from '../data/fakeData';
import Button, { ButtonProps } from '@mui/material/Button';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  ChartGeo.ChoroplethController,
  ChartGeo.ProjectionScale,
  ChartGeo.ColorScale,
  ChartGeo.GeoFeature
);

interface ColorButtonProps extends ButtonProps {
  isActived?: boolean;
}

export const ColorButton = styled(Button)<ColorButtonProps>(
  ({ isActived, theme }) => ({
    // color: theme.palette.getContrastText(purple[500]),
    // backgroundColor: purple[500],
    background: 'none',
    color: isActived ? '#FFFFFF' : '#92969B',
    backgroundColor: isActived ? '#422BFA' : '#FFFFFF',
    minWidth: 40,
    borderRadius: 0,
    '&:hover': {
      color: '#FFFFFF',
      backgroundColor: '#422BFA',
    },
    '&:active': {
      color: '#FFFFFF',
      backgroundColor: '#422BFA',
    },
  })
);

const StyledTabs = styled((props: StyledTabsProps) => (
  <Tabs
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicator': {
    display: 'none',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
    backgroundColor: '#635ee7',
  },
});

const StyledTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))(({ theme }) => ({
  textTransform: 'none',
  fontWeight: theme.typography.fontWeightBold,
  fontSize: theme.typography.pxToRem(15),
  backgroundColor: '#F5F6F9',
  color: '#92969B',
  '&.Mui-selected': {
    color: '#ffffff',
    backgroundColor: '#422BFA',
    border: 'none',
  },
  // '&.Mui-focusVisible': {
  //   backgroundColor: '#f0f1f8',
  //   color: '#b4b4b4',
  // },
}));

function ProductVolumByCountry({ productData }: { productData: Product[] }) {
  const [chartActive, setChartActive] = useState<number>(0);
  const chartRef = useRef();
  const [countries, setCountries] = useState<any>([]);

  useEffect(() => {
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
      .then((response) => response.json())
      .then((value) => {
        setCountries(
          (ChartGeo.topojson.feature(value, value.objects.countries) as any)
            .features
        );
      });
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setChartActive(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3} position={'relative'}>
          {/* <Box
            sx={{
              display: 'grid',
              position: 'absolute',
              left: '8px',
              top: '50%',
              background: '#ffffff',
              boxShadow: '0 0.5rem 1.2rem rgba(0,0,0,.2)',
            }}
          >
            <ColorButton>
              <NearMeOutlinedIcon />
            </ColorButton>
            <ColorButton isActived>
              <BackHandOutlinedIcon />
            </ColorButton>
            <ColorButton>
              <CategoryOutlinedIcon />
            </ColorButton>
          </Box> */}
          <Grid item xs={12} textAlign="right">
            <ColorButton>
              <AddCircleOutlineIcon />
            </ColorButton>
            <ColorButton>
              <RemoveCircleOutlineIcon />
            </ColorButton>
          </Grid>
          <Grid item xs={12}>
            <Chart
              ref={chartRef}
              type="choropleth"
              data={{
                labels: countries.map((d: any) => d.properties.name),
                datasets: [
                  {
                    label: 'Countries',
                    // backgroundColor: '#422BFA',
                    data: countries.map((d: any) => ({
                      feature: d,
                      value: Math.random() * 10,
                    })),
                  },
                ],
              }}
              options={{
                showOutline: false,
                showGraticule: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: false,
                    external: externalTooltip,
                  },
                },
                scales: {
                  projection: {
                    axis: 'x',
                    projection: 'equalEarth',
                  },
                },
              }}
            />
          </Grid>
          <Grid justifyContent={'center'} item xs={12}>
            <StyledTabs
              value={chartActive}
              onChange={handleChange}
              aria-label="scrollable prevent tabs example"
            >
              {headCharts.map((headChart) => (
                <StyledTab key={headChart.value} label={headChart.label} />
              ))}
            </StyledTabs>
          </Grid>
          <Grid justifyContent={'center'} item xs={12}>
            <Typography
              variant="h5"
              gutterBottom
              textAlign={'center'}
              fontWeight={700}
            >
              Product Volume by Country
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProductVolumByCountry;
