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

export default function SimpleTable({ rows, onChangePagarTodo}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
      <Paper className={classes.paper}>
        <Table className={classes.table} size="small">
                <TableHead>
                    <TableRow key={20} className="primary">
                        <TableCell ><strong>Mes</strong></TableCell>
                        <TableCell align="right"><strong>Valor administración</strong></TableCell>
                        <TableCell align="right"><strong>Valor interés</strong></TableCell>
                        <TableCell align="right"><strong>Valores pendientes</strong></TableCell>
                        <TableCell align="right"><strong>Valor total</strong></TableCell>                        
                        <TableCell><strong>Estado</strong></TableCell>
                        <TableCell><strong>Fecha pago</strong></TableCell>
                        <TableCell ><strong>Pagar</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow className={row.estado == "APROBADA" ? classes.backgroundColorAprobado : classes.backgroundColorNoAprobado} key={row.id}>
                            <TableCell><strong>{nombreMes(row.mes)}</strong></TableCell>
                            <TableCell align="right">${ccyFormat(row.valorAdministracion)}</TableCell>
                            <TableCell align="right">${ccyFormat(row.valorInteres)}</TableCell>
                            <TableCell align="right">${ccyFormat(row.valoresPendientes)}</TableCell>
                            <TableCell align="right">${ccyFormat(row.valorTotal)}</TableCell>
                            <TableCell><strong>{row.estado}</strong></TableCell>
                            <TableCell>{row.fechaPago != null ? row.fechaPago.substring(0,10) : ''}</TableCell>
                            <TableCell className={row.estado == "APROBADA" ? classes.noVisible : null} component="th" scope="row">
                                <Switch
                                    checked={row.checked}
                                    onChange={onChangePagarTodo}
                                    value={row.id}
                                    inputProps={{ 'aria-label': 'primary checkbox' }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                </Table>
      </Paper>
    </div>
    );
}