import React from 'react'

import { DndProvider } from 'react-dnd'
import Backend from 'react-dnd-html5-backend'
import SurveyDragnDrop from '../Survey/SurveyDragnDrop/SurveyDragnDrop'

export default function DragDrop() {
  return (
    <>
      <DndProvider backend={Backend}>
        <SurveyDragnDrop />
      </DndProvider>
    </>
  )
}
