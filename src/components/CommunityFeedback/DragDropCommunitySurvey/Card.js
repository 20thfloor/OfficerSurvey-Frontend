import React, { useImperativeHandle, useRef } from 'react'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import DehazeIcon from '@material-ui/icons/Dehaze'
import PropTypes from 'prop-types'

// eslint-disable-next-line react/display-name
const CardDrag = React.forwardRef(({ text, isDragging, connectDragSource, connectDropTarget }, ref) => {
  CardDrag.propTypes = {
    text: PropTypes.string.isRequired,
    isDragging: PropTypes.any.isRequired,
    connectDragSource: PropTypes.any.isRequired,
    connectDropTarget: PropTypes.any.isRequired
  }
  const elementRef = useRef(null)
  connectDragSource(elementRef)
  connectDropTarget(elementRef)
  const opacity = isDragging ? 0 : 1
  useImperativeHandle(ref, () => ({
    getNode: () => elementRef.current
  }))
  return (
    <div ref={elementRef} className="card card-box px-2 py-2 m-2 d-flex flex-row align-items-center">
      <DehazeIcon style={{ fontSize: 20, color: '#979797' }} />
      <p
        style={{
          opacity,
          fontWeight: '500px',
          fontSize: '16px',
          lineHeight: '24px',
          paddingLeft: '15px'
        }}>
        {text}
      </p>
    </div>
  )
})
export default DropTarget(
  ItemTypes.CARD,
  {
    // eslint-disable-next-line no-restricted-syntax
    hover(props, monitor, component) {
      if (!component) {
        return null
      }
      // node = HTML Div element from imperative API
      const node = component.getNode()
      if (!node) {
        return null
      }
      const dragIndex = monitor.getItem().index
      const hoverIndex = props.index
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = node.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }
      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex)
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      monitor.getItem().index = hoverIndex
    }
  },
  connect => ({
    connectDropTarget: connect.dropTarget()
  })
)(
  DragSource(
    ItemTypes.CARD,
    {
      beginDrag: props => ({
        id: props.id,
        index: props.index
      })
    },
    (connect, monitor) => ({
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging()
    })
  )(CardDrag)
)
