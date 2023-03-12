import React from 'react'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import CommunitySurveyRearrange from '../CommunitySurveyRearrange/CommunitySurveyRearrange'

export default function DragDrop() {
  return (
    <>
      <DndProvider backend={Backend}>
        <CommunitySurveyRearrange />
      </DndProvider>
    </>
  )
}
