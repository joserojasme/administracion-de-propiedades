import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';

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

export default function SubirPropiedadesTabla({ rows,}) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow key={20} className="primary">
                            <TableCell><strong>Validaciones</strong></TableCell>
                            <TableCell><strong>Estado de carga</strong></TableCell>
                            <TableCell><strong>Estado usuario</strong></TableCell>
                            <TableCell><strong>Tipo propiedad</strong></TableCell>
                            <TableCell><strong>Chip inmueble</strong></TableCell>
                            <TableCell><strong>Nomenclatura</strong></TableCell>
                            <TableCell><strong>Nombre Propietario</strong></TableCell>
                            <TableCell><strong>Identificación</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map(row => (
                            <TableRow key={row.id} style={row.conErrores ? {backgroundColor:"#f6c0c5"} : null}>
                                <TableCell>
                                {row.conErrores &&
                                row.mensajes.map(item=>(
                                    `${item}`
                                    ))
                                }
                                </TableCell>
                                <TableCell>
                                {`${row.estadoCarga}`}
                                </TableCell>
                                <TableCell>
                                {`${row.estadoUsuario}`}
                                </TableCell>
                                <TableCell>{`${row.tipoPropiedad}`}</TableCell>
                                <TableCell>{`${row.chipInmueble}`}</TableCell>
                                <TableCell>{`${row.nomenclatura}`}</TableCell>
                                <TableCell>{`${row.nombrePropietario}`}</TableCell>
                                <TableCell>{`${row.identificacionPropietario}`}</TableCell>
                                <TableCell>{`${row.email}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}