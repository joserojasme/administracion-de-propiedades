import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import {numberFormat, nombreMes} from '../utils/utilsFunctions';
import { Button } from 'reactstrap';

function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
}

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
      },
      paper: {
        
        width: '100%',
        overflowX: 'auto',
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 650,
      },
      backgroundColorAprobado:{
        backgroundColor:'#CEF6CE'
      },
      backgroundColorNoAprobado:{
        backgroundColor:'#FFF'
      },
      noVisible:{
          display:'none'
      }
}));

export default function SimpleTable({ rows, onChangeValidarPago}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow key={20} className="primary">
                    <TableCell ><strong>Acción</strong></TableCell>
                        <TableCell align="right"><strong>ValorPagado</strong></TableCell>
                        <TableCell ><strong>FechaSolicitud</strong></TableCell>
                        <TableCell ><strong>TipoPago</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow  key={row.id}>
                          <TableCell component="th" scope="row">
                            <Button color="info" value={row.idSolicitud} onClick={onChangeValidarPago} outline>
                            Validar pago
                            </Button>
                            </TableCell>
                            <TableCell align="right">${ccyFormat(row.valorPagado)}</TableCell>
                            <TableCell>{row.fechaSolicitud.substring(0,10)}</TableCell>
                            <TableCell>{row.tipoPago}</TableCell>
                            
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
      </Paper>
    </div>
    );
}
