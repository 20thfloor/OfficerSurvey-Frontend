import React, { useEffect, useState } from 'react'
import OfficerDashboard from './OfficerDashboard'
import SupervisorDashboard from './SupervisorDashboard'
import { getIsSupervisor } from '../../utils/localStorage'

const Dashboard = () => {
  const [localSupervisor, setLocalSupervisor] = useState(false)

  const setup = async () => {
    const localStorageSupervisor = await getIsSupervisor()
    await setLocalSupervisor(localStorageSupervisor)
  }
  useEffect(() => {
    setup()
  }, [])

  return <>{localSupervisor ? <SupervisorDashboard /> : <OfficerDashboard />}</>
}

export default Dashboard
