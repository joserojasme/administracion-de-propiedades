import React, { Fragment } from 'react';
import {
    Form, Modal, ModalBody, ModalHeader, FormGroup,
    Label, Card, CardImg
} from 'reactstrap';
import Avatar from '../../components/Avatar';

class NoticiasModal extends React.Component {
    state = {

    }

    render() {
        const { open, closeModal, noticia } = this.props;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}><strong>{noticia.titulo}</strong></ModalHeader>
                    <Form>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column" >
                            <Card>
                                <CardImg top src={noticia.urlImagen} />
                            </Card>

                            <hr />
                            {Object.entries(noticia).length !== 0 &&
                                <Fragment>
                                    <Label ><strong>Fecha publicación:</strong> {noticia.fecha}</Label>
                                    <Label >{noticia.descripcion}</Label>
                                </Fragment>
                            }

                        </ModalBody>
                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

export default NoticiasModal;
