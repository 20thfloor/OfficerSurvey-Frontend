import React from 'react'
import PropTypes from 'prop-types'
import ReactApexChart from 'react-apexcharts'
const OfficerDistributedBarGraph = ({
  xaxisList,
  seriesName,
  colors,
  categories,
  tickAmount,
  min,
  max,
  floating,
  decimalsInFloat
}) => {
  OfficerDistributedBarGraph.defaultProps = {
    xaxisList: [],
    seriesName: '',
    colors: '',
    categories: [],
    tickAmount: 0,
    min: 0,
    max: 0,
    floating: 0,
    decimalsInFloat: 0
  }
  OfficerDistributedBarGraph.propTypes = {
    xaxisList: PropTypes.any,
    seriesName: PropTypes.any,
    colors: PropTypes.any,
    categories: PropTypes.any,
    tickAmount: PropTypes.any,
    min: PropTypes.any,
    max: PropTypes.any,
    floating: PropTypes.any,
    decimalsInFloat: PropTypes.any
  }
  const series = [
    {
      name: seriesName,
      data: xaxisList
    }
  ]
  const options = {
    chart: {
      height: 350,
      type: 'bar'
    },
    colors: colors,
    plotOptions: {
      bar: {
        columnWidth: '10%',
        distributed: true
      }
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: false
    },
    xaxis: {
      categories: categories
    },
    yaxis: {
      tickAmount: tickAmount,
      min: min,
      max: max,
      floating: floating,
      decimalsInFloat: decimalsInFloat
    },
    tooltip: {
      enabled: true
    }
  }

  return (
    <>
      <div id="chart">
        <ReactApexChart options={options} series={series} type="bar" height={350} />
      </div>
    </>
  )
}
export default OfficerDistributedBarGraph
