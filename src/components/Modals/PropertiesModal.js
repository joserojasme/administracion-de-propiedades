import React, { Fragment } from 'react';
import { Badge, Card, CardBody, CardImg, CardTitle, Col, Form, FormGroup, ListGroup, ListGroupItem, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap';
import { numberFormat } from '../../utils/utilsFunctions';

function ccyFormat(num) {
    num = parseFloat(num);
    let value = `${num.toFixed(2)}`;
    return numberFormat(value);
  }

class PropertiesModal extends React.Component {
    render() {
        const { open, propertiesArray, onClick,horizontalPropertieNameModal } = this.props;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={onClick}>{horizontalPropertieNameModal}</ModalHeader>
                    <Form >
                        <ModalBody>

                            {propertiesArray.length !== 0 &&
                                propertiesArray.map(
                                    propertie => (
                                        <Row key={propertie.id}>
                                            <Col md={12} sm={12} xs={12} className="mb-3">
                                                <Card>
                                                    <CardImg top src={propertie.urlImagenPropiedad} />
                                                    <CardBody>
                                                        <CardTitle><strong> {propertie.tipoPropiedad}</strong>&nbsp;
                                                        {propertie.administracionAlDia ?
                                                            <Badge color="success" className="mr-1" >Al día</Badge>
                                                            :
                                                            <Badge color="danger" className="mr-1" >Pago pendiente</Badge>
                                                        }
                                                        </CardTitle>

                                                    </CardBody>
                                                    <ListGroup flush>
                                                        <ListGroupItem>
                                                            <CardTitle><strong> Información técnica: </strong></CardTitle>
                                                            Torre: {propertie.torre}, &nbsp;
                                                            Piso: {propertie.piso},  &nbsp;
                                                            Nomenclatura: {propertie.nomenclatura},  &nbsp;
                                                            Area privada: {propertie.areaPrivada}  m<sup>2</sup>,  &nbsp;
                                                            Matricula Inmobiliaria: {propertie.matriculaInmobiliaria},  &nbsp;
                                                            Chip: {propertie.chipInmueble},
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                        <strong>Valor administración:</strong>&nbsp;${ccyFormat(propertie.valorAdministracion)}
                                                        </ListGroupItem>
                                                        <ListGroupItem>
                                                        <CardTitle><strong> Arrendatario: </strong></CardTitle>
                                                        Nombre: {propertie.nombreArrendatario != null ? propertie.nombreArrendatario : ''},  &nbsp;
                                                        Celular: &nbsp;<a href={`tel:${propertie.celularArrendatario != null ? propertie.celularArrendatario : ''}`}>{propertie.celularArrendatario != null ? propertie.celularArrendatario : ''}</a>, &nbsp;
                                                        Fecha inicio arriendo: {propertie.fechaInicioArriendo != null ? propertie.fechaInicioArriendo.toString().substring(0, 10) : ''},  &nbsp;
                                                        Fecha fin arriendo: {propertie.fechaFinArriendo != null ? propertie.fechaFinArriendo.toString().substring(0, 10) :''},  &nbsp;
                                                        </ListGroupItem>
                                                    </ListGroup>


                                                </Card>
                                            </Col>
                                        </Row>
                                    )
                                )

                            }

                        </ModalBody>
                        <ModalFooter>
                            <FormGroup>

                            </FormGroup>

                        </ModalFooter>
                    </Form>
                </Modal>

            </Fragment>
        );
    }
}

export default PropertiesModal;
