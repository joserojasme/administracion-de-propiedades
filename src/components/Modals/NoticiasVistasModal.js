import React, { Fragment } from 'react';
import { Form, Modal, ModalBody, ModalHeader } from 'reactstrap';
import NoticiasVistas from '../NoticiasVistas';

class NoticiasVistasModal extends React.Component {
    state = {

    }

    render() {
        const { open, closeModal, noticiasVistas } = this.props;
        return (
            <Fragment>
                <Modal
                    size="xl"
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}>Noticias leídas</ModalHeader>
                    <Form>
                        <ModalBody className="d-flex justify-content-center align-items-center flex-column">
                            
                            {Object.entries(noticiasVistas).length !== 0 &&
                                <NoticiasVistas
                                    headers={[
                                        'Título Noticia',
                                        'Leida',
                                        'Fecha leida'
                                    ]}
                                    usersData={noticiasVistas}
                                />
                            }
                        </ModalBody>

                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

export default NoticiasVistasModal;
