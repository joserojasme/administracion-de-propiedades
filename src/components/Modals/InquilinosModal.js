import React, { Fragment } from 'react';
import { Form, Modal, ModalBody, ModalHeader, FormGroup,
    Label, } from 'reactstrap';
import Inquilinos from '../../components/Inquilinos';
import Avatar from '../../components/Avatar';
import { MdCall } from 'react-icons/md';

class InquilinosModal extends React.Component {
    state = {

    }

    render() {
        const { open, closeModal, inquilinos } = this.props;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered
                    >
                    <ModalHeader toggle={closeModal}>¿A quién va a llamar?</ModalHeader>
                    <Form>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column">
                            {Object.entries(inquilinos).length !== 0 &&
                            <Fragment>
                                <a href={`tel:${inquilinos.copropietario.celularPropietario}`}>
                                <Avatar
                                    size={150}
                                    className="mb-3"
                                    src={inquilinos.copropietario.urlImagenPropietario}
                                /></a>
                                    <Label ><strong>Propietario:</strong> {inquilinos.copropietario.nombrePropietario}</Label>
                                    <Label ><strong>Apartamento:</strong> {inquilinos.inquilinos.nomenclatura} <a href={`tel:${inquilinos.copropietario.celularPropietario}`}><MdCall/></a></Label>
                                </Fragment>
                            }
                            {Object.entries(inquilinos).length !== 0 &&
                                <Inquilinos
                                    headers={[
                                        'Nombre',
                                        'Celular',
                                        'Teléfono'
                                    ]}
                                    usersData={inquilinos.inquilinos}
                                />
                            }
                        </ModalBody>

                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

export default InquilinosModal;
