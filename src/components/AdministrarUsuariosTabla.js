import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import React from 'react';
import { Button } from 'reactstrap';

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

export default function AdministrarUsuariosTabla({ rows, handleClickBorrar, handleClickInvitar, handleClickEditar }) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Table className={classes.table} size="small">
                    <TableHead>
                        <TableRow key={20} className="primary">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell><strong>Nombre</strong></TableCell>
                            <TableCell><strong>Rol</strong></TableCell>
                            <TableCell><strong>Identificación</strong></TableCell>
                            <TableCell><strong>Email</strong></TableCell>
                            <TableCell><strong>Invitado</strong></TableCell>
                            <TableCell><strong>Cuando</strong></TableCell>
                            <TableCell><strong>Entró App</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody >
                        {rows.map(row => (
                            <TableRow key={row.copropietarios.id}>
                                <TableCell component="th" scope="row">
                                    <Button onClick={handleClickEditar} value={JSON.stringify(row)} outline>
                                        Editar
                                    </Button>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    <Button onClick={handleClickBorrar} value={row.copropietarios.usuarioCognito} outline>
                                        Borrar
                                    </Button>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {row.copropietariosPropiedades.entroApp === 0 &&
                                        <Button onClick={handleClickInvitar} value={JSON.stringify(row)} outline>
                                            Invitar
                                    </Button>
                                    }
                                </TableCell>
                                <TableCell>{`${row.copropietarios.nombre.substring(0, 20)}...`}</TableCell>
                                <TableCell>{`${row.copropietariosPropiedades.rolUsuario}`}</TableCell>
                                <TableCell>{row.copropietarios.identificacion}</TableCell>
                                <TableCell>{row.copropietarios.email}</TableCell>
                                <TableCell>{row.copropietariosPropiedades.invitadoApp === 0 ? 'NO' : 'SI'}</TableCell>
                                <TableCell>{row.copropietariosPropiedades.invitadoApp === 1 ? row.copropietariosPropiedades.fechaUltimaInvitacion.substring(0, 10) : ''}</TableCell>
                                <TableCell>{row.copropietariosPropiedades.entroApp === 0 ? 'NO' : 'SI'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}