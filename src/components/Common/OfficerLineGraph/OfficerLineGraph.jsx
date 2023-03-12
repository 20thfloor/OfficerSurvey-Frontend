import React from 'react'
import Chart from 'react-apexcharts'
import OfficerLoader from '../OfficerLoader'
import PropTypes from 'prop-types'

const OfficerLineGraph = ({ yaxisList, xaxisList, isFetching }) => {
  OfficerLineGraph.propTypes = {
    yaxisList: PropTypes.any.isRequired,
    xaxisList: PropTypes.any.isRequired,
    isFetching: PropTypes.any.isRequired
  }
  const series = [
    {
      name: 'Avg. Rating',
      data: yaxisList
    }
  ]
  const optionsLine = {
    noData: {
      text: 'No data to show',
      align: 'center',
      verticalAlign: 'middle',
      offsetX: 0,
      offsetY: 0,
      style: {
        color: '#323c47',
        fontSize: '20px',
        fontFamily: 'Poppins'
      }
    },
    chart: {
      type: 'area',

      toolbar: {
        show: true
      }
    },
    colors: ['#77B6EA'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth'
    },
    title: {
      text: 'Overview',
      align: 'left',
      style: {
        fontSize: '20px',
        fontWeight: '600',
        fontFamily: 'Poppins',
        color: '#263238'
      }
    },
    grid: {
      borderColor: '#e7e7e7',
      row: {
        colors: ['transparent'],
        opacity: 0.1
      }
    },
    xaxis: {
      categories: xaxisList,
      title: {
        text: 'Date'
      }
    },
    yaxis: {
      title: {
        text: 'Rating'
      },
      min: 1.0,
      max: 5.0
    }
  }

  return (
    <>
      <OfficerLoader isFetching={isFetching}>
        <Chart options={optionsLine} series={series} type={'area'} height="500px" />
      </OfficerLoader>
    </>
  )
}

export default OfficerLineGraph
