import React from 'react'
import Chart from 'react-apexcharts'
import PropTypes from 'prop-types'

const OfficerBarGraph = ({ xaxisList, yaxisList }) => {
  OfficerBarGraph.propTypes = {
    xaxisList: PropTypes.any.isRequired,
    yaxisList: PropTypes.any.isRequired
  }
  const series = [
    {
      name: 'Percentage',
      data: xaxisList
    }
  ]

  const optionsLine = {
    chart: {
      type: 'bar',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: true,
        dataLabels: {
          position: 'center'
        }
      }
    },

    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        colors: ['#fff']
      }
    },

    xaxis: {
      categories: yaxisList,
      labels: {
        show: false
      }
    },

    fill: {
      colors: [
        // eslint-disable-next-line no-restricted-syntax
        function ({ value }) {
          if (value <= 20) {
            return '#EA0001'
          } else if (value <= 40) {
            return '#FA9924'
          } else if (value <= 60) {
            return '#FBBF07'
          } else if (value <= 80) {
            return '#92D14F'
          } else {
            return '#0CA651'
          }
        }
      ]
    }
  }

  return <Chart options={optionsLine} series={series} type={'bar'} height="200" />
}

export default OfficerBarGraph
