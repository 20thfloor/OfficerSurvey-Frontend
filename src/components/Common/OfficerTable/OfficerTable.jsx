/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/destructuring-assignment */
import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { CircularProgress, Hidden, IconButton } from '@material-ui/core'
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRightIcon from '@material-ui/icons/KeyboardArrowRight'
import greyLogo from '../../../assets/logo_grey.png'
import { Div, FooterDiv, IconDiv, TableHeadings, NoData, TableHeadingsWhite } from './OfficerTableStyle'
import { OfficerCard } from '..'
import './OfficerTable'
import PropTypes from 'prop-types'

const StyledTableCell = withStyles(() => ({
  head: {
    color: '#194FBB'
  },
  body: {
    fontSize: 14
  }
}))(TableCell)

const StyledTableRow = withStyles(() => ({
  root: {
    '&:nth-of-type(odd)': {
      // backgroundColor: theme.palette.action.hover,
    }
  }
}))(TableRow)

export default function CustomizedTables(props) {
  CustomizedTables.defaultProps = {
    color: '',
    headerColor: '',
    emptyPlaceholder: '',
    totalCount: 0,
    showPaginationTop: false,
    pagination: false,
    disablePrevious: false,
    disableNext: false,
    data: [],
    page: 0,
    pageLimit: 0,
    onChangePage: () => null,
    showSpinner: false
  }
  CustomizedTables.propTypes = {
    pagination: PropTypes.bool,
    emptyPlaceholder: PropTypes.any,
    data: PropTypes.array,
    headers: PropTypes.array.isRequired,
    showSpinner: PropTypes.bool,
    page: PropTypes.number,
    disablePrevious: PropTypes.bool,
    disableNext: PropTypes.bool,
    pageLimit: PropTypes.number,
    totalCount: PropTypes.number,
    showPaginationTop: PropTypes.any,
    headerColor: PropTypes.any,
    color: PropTypes.any,
    onChangePage: PropTypes.func
  }
  const pagination = props.pagination
  const data = props.data
  const headers = props.headers
  const headerColor = props.headerColor
  const showSpinner = props.showSpinner
  const page = props.page
  const disablePrevious = props.disablePrevious
  const disableNext = props.disableNext
  const pageLimit = props.pageLimit
  const totalCount = props.totalCount
  const headingColor = props.color
  const onChangePage = props.onChangePage

  const showPagination = () => {
    return data.length > 0 && pagination ? (
      <Div>
        <div className="d-flex justify-content-end align-items-center ">
          <FooterDiv>
            Show on page {page * pageLimit - pageLimit + 1}-
            {totalCount <= pageLimit * page ? totalCount : pageLimit * page} out of {totalCount}
          </FooterDiv>
          <IconDiv className="d-flex">
            <IconButton
              color="primary"
              title="Clear"
              disabled={disablePrevious}
              component="span"
              onClick={() => {
                onChangePage(page - 1)
              }}
              className="iconsPadding">
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              color="primary"
              title="Clear"
              disabled={disableNext}
              component="span"
              onClick={() => {
                onChangePage(page + 1)
              }}>
              <KeyboardArrowRightIcon />
            </IconButton>
          </IconDiv>
        </div>
      </Div>
    ) : null
  }

  return (
    <>
      {props.showPaginationTop ? showPagination() : null}
      <OfficerCard
        pl="0px"
        pr="0px"
        pt="0px"
        pb="0px"
        mb="0px"
        mt="0px"
        shouldFullHeight
        h={data.length > 0 && pagination ? '90%' : '100%'}>
        <TableContainer style={data.length === 0 ? { height: '100%' } : null}>
          <Hidden smDown>
            <Table aria-label="customized table" style={data.length === 0 ? { height: '100%' } : null}>
              <TableHead style={{ backgroundColor: headerColor }}>
                <TableRow>
                  {headers.map(headerItem => (
                    <StyledTableCell key={headerItem} align="center">
                      {headingColor ? (
                        <TableHeadingsWhite>{headerItem}</TableHeadingsWhite>
                      ) : (
                        <TableHeadings>{headerItem}</TableHeadings>
                      )}
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              {showSpinner ? (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={props.headers.length}>
                      <CircularProgress variant="indeterminate" />
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              ) : (
                <TableBody style={{ height: '100%' }}>
                  {data.length > 0 ? (
                    data.map((row, count) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <StyledTableRow key={count + 'tr'}>
                        {row.map((item, count) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <StyledTableCell key={count + 'tc'}>{item}</StyledTableCell>
                        ))}
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow style={{ height: '100%' }}>
                      <StyledTableCell align="center" colSpan={props.headers.length} style={{ height: '100%' }}>
                        <img src={greyLogo} width="80" height="80" alt="grey logo img" />
                        <NoData>{props.emptyPlaceholder ? props.emptyPlaceholder : 'No data to show'}</NoData>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </Hidden>
          <Hidden mdUp>
            <Table aria-label="customized table">
              {showSpinner ? (
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell align="center" colSpan={2}>
                      <CircularProgress variant="indeterminate" />
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              ) : (
                <TableBody key="bodyKey">
                  {data.length > 0 ? (
                    data.map((row, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <StyledTableRow key={index}>
                        <TableCell colSpan={2}>
                          <Table aria-label="customized table">
                            <TableBody>
                              {headers.map((headerItem, count) => (
                                // eslint-disable-next-line react/no-array-index-key
                                <TableRow key={count}>
                                  <TableCell align="center" key="cellKey">
                                    <TableHeadings>{headerItem}</TableHeadings>
                                  </TableCell>
                                  <TableCell align="center">{row[count]}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </StyledTableRow>
                    ))
                  ) : (
                    <StyledTableRow style={{ height: '100%' }}>
                      <StyledTableCell align="center" colSpan={props.headers.length} style={{ height: '100%' }}>
                        <img src={greyLogo} width="80" height="80" alt="grey logo img" />
                        <NoData>No data to show</NoData>
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              )}
            </Table>
          </Hidden>
        </TableContainer>
      </OfficerCard>

      {!props.showPaginationTop ? showPagination() : null}
    </>
  )
}
