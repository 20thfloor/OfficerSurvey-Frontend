import React from 'react'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import EmployeeSurveyRearrange from '../EmployeeSurveyRearrange/EmployeeSurveyRearrange'

export default function DragDrop() {
  return (
    <>
      <DndProvider backend={Backend}>
        <EmployeeSurveyRearrange />
      </DndProvider>
    </>
  )
}
