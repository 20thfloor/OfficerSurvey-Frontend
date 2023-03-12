/* eslint-disable react/jsx-one-expression-per-line */

import React from 'react'
import PropTypes from 'prop-types'
import RedSmile from '../../../assets/redsmile.svg'
import YellowSmile from '../../../assets/yellowsmile.svg'
import OrangeSmile from '../../../assets/orangesmile.svg'
import LightGreenSmile from '../../../assets/lightgreensmile.svg'
import GreenSmile from '../../../assets/greemsmile.svg'

const OfficerSmilegraph = ({ surveyResponse, list }) => {
  OfficerSmilegraph.defaultProps = {
    surveyResponse: {},
    list: []
  }

  OfficerSmilegraph.propTypes = {
    surveyResponse: PropTypes.any,
    list: PropTypes.any
  }
  return (

    <>
    
      <div
        className=" d-flex justify-content-center align-items-center pt-5 pb-5"
        style={{ height: '36px', fontWeight: '700', fontSize: '24px', fontFamily: 'Poppins' }}>
        Is Your Community Happy or Not?
      </div>
      {list.map((item, index) => {
        const percent = (item / surveyResponse.total) * 100
        return (
          <div className="rating_div mt-2 mb-2" key={`Smile${index + 2}`}>
            <div className="rating_col d-flex align-items-center">
              <div style={{ width: '7%' }}>
                <img
                  src={
                    index === 4
                      ? GreenSmile
                      : index === 3
                      ? LightGreenSmile
                      : index === 2
                      ? YellowSmile
                      : index === 1
                      ? OrangeSmile
                      : index === 0
                      ? RedSmile
                      : ''
                  }
                  alt="smiley"
                />
              </div>
              <div className="progress" style={{ height: '25px', width: '95%' }}>
                <div
                  className={'progress-bar'}
                  role="progressbar"
                  style={
                    index === 4
                      ? {
                          width: `${(item / surveyResponse.total) * 100}%`,
                          ariaValuenow: '25',
                          ariaValuemin: '0',
                          ariaValuemax: '100',
                          backgroundColor: '#0CA651'
                        }
                      : index === 3
                      ? {
                          width: `${(item / surveyResponse.total) * 100}%`,
                          ariaValuenow: '25',
                          ariaValuemin: '0',
                          ariaValuemax: '100',
                          backgroundColor: '#92D14F'
                        }
                      : index === 2
                      ? {
                          width: `${(item / surveyResponse.total) * 100}%`,
                          ariaValuenow: '25',
                          ariaValuemin: '0',
                          ariaValuemax: '100',
                          backgroundColor: '#FBBF07'
                        }
                      : index === 1
                      ? {
                          width: `${(item / surveyResponse.total) * 100}%`,
                          ariaValuenow: '25',
                          ariaValuemin: '0',
                          ariaValuemax: '100',
                          backgroundColor: '#FA9924'
                        }
                      : index === 0
                      ? {
                          width: `${(item / surveyResponse.total) * 100}%`,
                          ariaValuenow: '25',
                          ariaValuemin: '0',
                          ariaValuemax: '100',
                          backgroundColor: '#EA0001'
                        }
                      : ''
                  }
                />
              </div>
            </div>
            <div className="rating_colrght d-flex align-items-center justify-content-between">
              <div className="mt-2 mb-2 font-weight-bold">
                {index === 4
                  ? '5 star'
                  : index === 3
                  ? '4 star'
                  : index === 2
                  ? '3 star'
                  : index === 1
                  ? '2 star'
                  : index === 0
                  ? '1 star'
                  : ''}
              </div>
              <div className="mt-2 mb-2 font-weight-bold">
                {percent === 0 ? 0 : isNaN(percent) ? 0 : percent.toFixed(1)}%
              </div>
            </div>
          </div>
        )
      })}
    </>
  )
}
export default OfficerSmilegraph
