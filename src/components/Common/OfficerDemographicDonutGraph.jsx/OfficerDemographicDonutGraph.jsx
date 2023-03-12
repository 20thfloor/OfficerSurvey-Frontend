import React from 'react'
import ReactApexChart from 'react-apexcharts'
import PropTypes from 'prop-types'

const OfficerDemographicDountGraph = ({ xaxisList, label, color }) => {
  OfficerDemographicDountGraph.defaultProps = {
    xaxisList: [],
    label: [],
    color: []
  }

  OfficerDemographicDountGraph.propTypes = {
    xaxisList: PropTypes.any,
    label: PropTypes.any,
    color: PropTypes.any
  }

  const options = {
    chart: {
      type: 'donut'
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 50
          },
          legend: {
            position: 'bottom'
          }
        }
      }
    ],
    dataLabels: {
      enabled: false,
      style: {
        fontSize: '140px',
        fontWeight: 'bold'
      }
    },
    labels: label,
    legend: {
      width: 150
    },
    colors: color
  }

  return (
    <>
      <div id="chart">
        <ReactApexChart options={options} series={xaxisList} type="donut" />
      </div>
    </>
  )
}
export default OfficerDemographicDountGraph
