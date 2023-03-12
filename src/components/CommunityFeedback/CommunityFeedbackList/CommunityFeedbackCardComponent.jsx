/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useHistory } from 'react-router-dom'
import { CardMain, CardTextStyle, CardImageContainer, CommunityFeedbackHeading } from './CommunityFeedbackStyle'
import Recruitment from '../../../assets/recruitment2.svg'
import Employee from '../../../assets/employee.svg'
import Handshake from '../../../assets/handshake.svg'
import Presentation from '../../../assets/presentation2.svg'
import Pulse from '../../../assets/pulse2.svg'
import Rate from '../../../assets/rate.svg'
import Exit from '../../../assets/exit.svg'
import Mentalhealth from '../../../assets/policeman.svg'
import Police from '../../../assets/policeman22.svg'
import Other from '../../../assets/other2.svg'
import Organization from '../../../assets/organization.svg'
import School from '../../../assets/schoolSaftey2.svg'
import SmallBussiness from '../../../assets/smallBussiness2.svg'
import policePublic from '../../../assets/policePublic2.svg'
import Crime from '../../../assets/crime2.svg'
import CommunityEngagment from '../../../assets/communityEngagment2.svg'
import PublicSafety from '../../../assets/publicSafety.svg'
import Handpulse from '../../../assets/handPulse2.svg'
import Resident from '../../../assets/Resident2.svg'

import { useState, useEffect } from 'react'

const CommunityFeedbackCardComponent = () => {
  const pathname = window.location.pathname
  const [coummunityCard, setCommunityCard] = useState(false)

  const communityCardData = [
    {
      title: 'Citizen Police Academy Surveys',
      image: Police,
      route: 'Citizen_Police_Academy'
    },
    {
      title: 'Community Engagement Surveys',
      image: CommunityEngagment,
      route: 'Community_Engagement'
    },
    {
      title: 'Crime Surveys',
      image: Crime,
      route: 'Crime'
    },
    {
      title: 'Police Public Contact Surveys',
      image: policePublic,
      route: 'Police_Public_Contact'
    },
    {
      title: 'Public Safety Surveys',
      image: PublicSafety,
      route: 'Public_Safety'
    },
    {
      title: 'Community Pulse Surveys',
      image: Handpulse,
      route: 'Community_Pulse'
    },
    {
      title: 'Resident Satisfaction Surveys',
      image: Resident,
      route: 'Resident_Statisfaction'
    },
    {
      title: 'Small Business Surveys',
      image: SmallBussiness,
      route: 'Small_Buisness'
    },
    {
      title: 'School Safety Surveys',
      image: School,
      route: 'School_Safety'
    },

    {
      title: 'Everything Else Surveys',
      image: Other,
      route: 'Everything'
    }
  ]
  const employeeCardData = [
    {
      title: 'Recruitment Survey',
      image: Recruitment,
      route: 'Recruitment'
    },
    {
      title: 'Pre-Employment Surveys',
      image: Employee,
      route: 'Pre-Employment'
    },
    {
      title: 'Onboarding Surveys',
      image: Handshake,
      route: 'Onboarding'
    },
    {
      title: 'Training Surveys',
      image: Presentation,
      route: 'Training'
    },
    {
      title: 'Pulse Surveys',
      image: Pulse,
      route: 'Pulse'
    },
    {
      title: 'Employee Satisfaction Surveys',
      image: Rate,
      route: 'Employee'
    },
    {
      title: 'Organizational Surveys',
      image: Organization,
      route: 'Organizational'
    },
    {
      title: 'Exit Surveys',
      image: Exit,
      route: 'Exit'
    },
    {
      title: 'Mental Health Surveys',
      image: Mentalhealth,
      route: 'Mental'
    },
    {
      title: 'Police Academy Training Surveys',
      image: Police,
      route: 'Police'
    },
    {
      title: 'Everything Else Surveys',
      image: Other,
      route: 'Everything'
    }
  ]
  const history = useHistory()
  const cardSelection = (route, title) => {
    if (pathname === '/employee-feedback') {
      history.push({ pathname: `employee-feedback-survey/${route}`, state: { detail: title } })
    } else if (pathname === '/community-feedback') {
      history.push({ pathname: `community-feedback/${route}`, state: { detail: title } })
    }
  }
  useEffect(() => {
    if (pathname === '/employee-feedback') {
      setCommunityCard(true)
    } else if (pathname === '/community-feedback') {
      setCommunityCard(false)
    }
  }, [coummunityCard])

  return (
    <>
      <div>
        {!coummunityCard ? (
          <div>
            <CommunityFeedbackHeading>Community Surveys</CommunityFeedbackHeading>
            <div className="d-flex align-items-center flex-wrap" style={{ flexDirection: 'row' }}>
              {communityCardData.map(item => {
                const { id } = item
                return (
                  <div key={`${id}`} style={{ height: '190px', padding: '12px' }}>
                    <CardMain onClick={() => cardSelection(item.route, item.title)}>
                      <div
                        className="d-flex justify-content-around align-items-center flex-column"
                        style={{ height: '180px' }}>
                        <CardImageContainer>
                          <img src={item.image} alt="cardImg" />
                        </CardImageContainer>
                        <CardTextStyle>{item.title}</CardTextStyle>
                      </div>
                    </CardMain>
                  </div>
                )
              })}
            </div>
            <div />
          </div>
        ) : (
          <div>
            <CommunityFeedbackHeading>Employee Surveys</CommunityFeedbackHeading>
            <div className="d-flex align-items-center flex-wrap" style={{ flexDirection: 'row' }}>
              {employeeCardData.map(item => {
                const { id } = item
                return (
                  <div key={`${id}`} style={{ height: '190px', padding: '12px' }}>
                    <CardMain onClick={() => cardSelection(item.route, item.title)}>
                      <div
                        className="d-flex justify-content-around align-items-center flex-column"
                        style={{ height: '180px' }}>
                        <CardImageContainer>
                          <img src={item.image} alt="cardImg" />
                        </CardImageContainer>
                        <CardTextStyle>{item.title}</CardTextStyle>
                      </div>
                    </CardMain>
                  </div>
                )
              })}
            </div>
            <div />
          </div>
        )}
      </div>
    </>
  )
}
export default CommunityFeedbackCardComponent
