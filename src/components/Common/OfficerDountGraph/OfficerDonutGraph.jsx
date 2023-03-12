/* eslint-disable react/destructuring-assignment */
import React from 'react'
import Chart from 'react-apexcharts'
import OfficerLoader from '../OfficerLoader'
import PropTypes from 'prop-types'

const OfficerPieGraph = ({
  isFetching,
  showText,
  response,
  percent,
  innerText,
  tooltip,
  dataLabel,
  label,
  color,
  list,
  onSelect
}) => {
  OfficerPieGraph.defaultProps = {
    showText: '',
    response: () => {},
    percent: '',
    innerText: '',
    tooltip: '',
    dataLabel: '',
    label: '',
    color: undefined,
    onSelect: () => {},
    isFetching: false
  }

  OfficerPieGraph.propTypes = {
    showText: PropTypes.any,
    response: PropTypes.any,
    percent: PropTypes.any,
    innerText: PropTypes.any,
    tooltip: PropTypes.any,
    dataLabel: PropTypes.any,
    label: PropTypes.any,
    onSelect: PropTypes.any,
    isFetching: PropTypes.bool,
    list: PropTypes.any.isRequired,
    color: PropTypes.array
  }

  const options = {
    plotOptions: {
      pie: {
        donut: {
          background: 'transparent',
          labels: {
            show: true,
            name: {
              show: showText === true ? true : false,
              fontSize: '22px',
              fontFamily: 'Poppins',
              fontWeight: 500,
              color: '#000000',
              // offsetY: -10,
              // eslint-disable-next-line no-restricted-syntax
              formatter: function (val) {
                return val
              }
            },
            value: {
              show: true,
              fontSize: showText === true ? '18px' : '26px',
              fontFamily: 'Poppins',
              fontWeight: showText === true ? 400 : 600,
              color: '#000000',
              offsetY: showText === true ? 0 : 10
              // formatter: function (val) {
              //   return val
              // },
            },
            total: {
              show: true,
              showAlways: true,
              label: response,
              fontSize: '24px',
              fontFamily: 'Poppins',
              fontWeight: 600,
              color: '#000000',
              // eslint-disable-next-line no-restricted-syntax
              formatter: function () {
                if (percent !== 0) {
                  const percent_str = `${percent}%`
                  return percent_str
                } else if (response != null) {
                  const response = `${innerText}`
                  return response
                } else {
                  return 'No Data To Show'
                }
              }
            }
          }
        }
      }
    },

    dataLabels: {
      enabled: dataLabel === false ? false : true
    },
    tooltip: {
      enabled: tooltip === false ? false : true
    },

    labels: label ? label : ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'],
    values: [1, 2, 3, 4, 5],
    // eslint-disable-next-line react/prop-types
    colors: color ? color : ['#EA0001', '#FA9924', '#FBBF07', '#92D14F', '#0CA651'],
    '&:hover': ['#E57373', '#FEB74E', '#FFF275', '#FEB74E', '#E57373'],
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
      type: 'donut',
      events: {
        dataPointSelection: (event, chartContext, config) => {
          onSelect(config.w.config.values[config.dataPointIndex])
        }
      }
    },
    legend: {
      show: false
    }
  }

  return (
    <>
      <OfficerLoader isFetching={isFetching}>
        <Chart options={options} series={list} type="donut" width="320" />
      </OfficerLoader>
    </>
  )
}

export default OfficerPieGraph
