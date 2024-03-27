import React, { ReactElement, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button, { ButtonProps } from '@mui/material/Button';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import TimelineIcon from '@mui/icons-material/Timeline';
import TooltipMui from '@mui/material/Tooltip';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { headCharts } from '../data/fakeData';
import { Product, StyledTabProps, StyledTabsProps } from '../types';
import externalTooltip from './chart/customTooltip';

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
}));

interface ColorButtonProps extends ButtonProps {
  isActived?: boolean;
}

export const ColorButton = styled(Button)<ColorButtonProps>(
  ({ isActived, theme }) => ({
    // color: theme.palette.getContrastText(purple[500]),
    // backgroundColor: purple[500],
    background: 'none',
    color: isActived ? '#422BFA' : '#92969B',
    minWidth: 40,
    '&:hover': {
      color: '#422BFA',
    },
    '&:active': {
      color: isActived ? '#422BFA' : '#92969B',
    },
  })
);

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip
);

export const chartOptions = {
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 14,
          weight: 600,
        },
      },
    },
    y: {
      beginAtZero: true,
      ticks: {
        font: {
          size: 14,
          weight: 600,
        },
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: false,
      external: externalTooltip,
    },
  },
};

interface ChartType {
  id: number;
  label: string;
  value: 'BAR' | 'LINE';
  icon: ReactElement;
}

const CHART_TYPE: { [key: string]: ChartType } = {
  BAR: {
    id: 0,
    label: 'Bar',
    value: 'BAR',
    icon: <SignalCellularAltIcon />,
  },
  LINE: {
    id: 1,
    label: 'Line',
    value: 'LINE',
    icon: <TimelineIcon />,
  },
};

function ProductTransactionsChart({ productData }: { productData: Product[] }) {
  const [chartType, setChartType] = useState<string>('BAR');
  const [chartActive, setChartActive] = useState<number>(0);

  const labels = productData.map((product) => product.product);
  const chartActiveData = headCharts.find(
    (headChart) => headChart.id === chartActive
  );
  if (!chartActiveData?.label) return null;

  const barChartData = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: chartActiveData?.label,
        backgroundColor: '#422BFA',
        data: productData.map((product) => product[chartActiveData?.value]),
        borderColor: 'white',
        borderWidth: 2,
        borderRadius: 6,
        fontWeight: 600,
      },
    ],
  };

  const lineChartData = {
    labels,
    datasets: [
      {
        type: 'line' as const,
        label: chartActiveData?.label,
        backgroundColor: '#422BFA',
        borderColor: '#422BFA',
        data: productData.map((product) => product[chartActiveData?.value]),
        pointStyle: 'circle',
        pointRadius: 10,
        pointHoverRadius: 15,
      },
    ],
  };

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setChartActive(newValue);
  };

  const handleSelectChart = (newValue: string) => {
    setChartType(newValue);
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {Object.values(CHART_TYPE).map((chart: ChartType) => (
              <ColorButton
                key={chart.id}
                onClick={() => handleSelectChart(chart.value)}
                isActived={chart.value === chartType}
              >
                <TooltipMui title={chart.label}>{chart.icon}</TooltipMui>
              </ColorButton>
            ))}
          </Grid>
          <Grid item xs={12}>
            {chartType === 'BAR' && (
              <Chart type="bar" options={chartOptions} data={barChartData} />
            )}
            {chartType === 'LINE' && (
              <Chart type="line" options={chartOptions} data={lineChartData} />
            )}
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
              Product Transactions Chart
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default ProductTransactionsChart;
