import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { MdDelete, MdAlarm, MdRateReview } from 'react-icons/md';
import { Button } from 'reactstrap';
import {numberFormat} from '../utils/utilsFunctions';

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
    backgroundColorAprobado: {
        backgroundColor: '#CEF6CE'
    },
    backgroundColorNoAprobado: {
        backgroundColor: '#FFF'
    },
    noVisible: {
        display: 'none'
    }
}));

export default function AdministrarZonasComunesTabla({ rows, handleClickBorrar, handleClickInventario, handleClickEditar }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow key={20} className="primary">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Descripción</strong></TableCell>
                            <TableCell align="right"><strong>Valor reserva</strong></TableCell>
                            <TableCell align="right"><strong>Valor deposito</strong></TableCell>
                            <TableCell><strong>Inventario</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map(row => (
                            <TableRow key={row.id}>
                                <TableCell component="th" scope="row">
                                    <Button onClick={handleClickEditar} value={row.id} outline>
                                        Editar
                                    </Button>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Button onClick={handleClickBorrar} value={row.id} outline>
                                        Borrar
                                    </Button>
                                </TableCell>
                                <TableCell>{`${row.nombre.substring(0, 200)}...`}</TableCell>
                                <TableCell>{`${row.descripcion.substring(0, 200)}...`}</TableCell>
                                <TableCell align="right">{`$${ccyFormat(row.valorReserva)}`}</TableCell>
                                <TableCell align="right">{`$${ccyFormat(row.valorDeposito)}`}</TableCell>
                                <TableCell component="th" scope="row">
                                    <Button onClick={handleClickInventario} value={row.id} outline>
                                        Ver
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}