import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Box,IconButton } from '@mui/material';
import {  DeleteOutlined } from '@mui/icons-material';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#E3E3E3',
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
 
  // hide last border
  '&:last-child td, &:last-child th': {
    
    color: theme.palette.common.black,
  
  },
}));

function createData(time, source, message) {
  return {time, source, message};
}

const rows = [
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  
  createData('03 October 03 : 14 00:15 ', 'Network', 'Connection established with server.'),  

  



];

export default function Journal() {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Time</StyledTableCell>
            <StyledTableCell align="center">Source</StyledTableCell>
            <StyledTableCell align="center">Message</StyledTableCell>


            
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row,index) => (
            <StyledTableRow key={index}>
              
              <StyledTableCell align="center">{row.time}</StyledTableCell>
              <StyledTableCell align="center">{row.source}</StyledTableCell>
              <StyledTableCell align="center">{row.message}</StyledTableCell>
             
             
              
            </StyledTableRow>
                        ))}
      
        </TableBody>
      </Table>
    </TableContainer>
  );
}
