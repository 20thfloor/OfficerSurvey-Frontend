import React from 'react'
import { GraphDiv } from './PieGraphStyle'
import PropTypes from 'prop-types'
import ReactApexChart from 'react-apexcharts'

const OfficerPieGraph = ({ xaxisList, flag, seriesName }) => {
  OfficerPieGraph.propTypes = {
    xaxisList: PropTypes.array.isRequired,
    flag: PropTypes.string.isRequired,
    seriesName: PropTypes.array.isRequired
  }

  const series = [
    {
      name: seriesName,
      data: xaxisList
    }
  ]

  var bar = {
    borderRadius: 10,
    columnWidth: 40,
    distributed: true
  }
  if (flag === 'gender') {
    bar.columnWidth = 20
  }

  var categories = ['']
  if (flag === 'gender') {
    categories = [['Other'], ['Female'], ['Male']]
  }

  const optionsLine = {
    plotOptions: {
      bar: bar
    },
    colors: [
      '#007bff',
      '#fcbf07',
      '#8E30FF',
      '#EA0102',
      '#0ca550',
      '#26D7AE',
      '#17a2b8',
      '#ffc107',
      '#6610f2',
      '#dc3545'
    ],
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    legend: {
      show: false,
      position: 'bottom'
    },
    dataLabels: {
      enabled: false,
      style: {
        colors: '#000000'
      },
      formatter: val => {
        return val + '%'
      }
    },
    xaxis: {
      categories: categories,
      axisBorder: {
        show: false
      },
      labels: {
        show: false
      }
    },
    yaxis: {
      axisBorder: {
        show: false
      },
      axisTicks: {
        show: true
      },
      labels: {
        show: false
      }
    }
  }

  return (
    <>
      <GraphDiv>
        <ReactApexChart options={optionsLine} series={series} type={'bar'} height="200" />
      </GraphDiv>
    </>
  )
}

export default OfficerPieGraph
