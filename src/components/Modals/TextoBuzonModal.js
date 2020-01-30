import React, { Fragment } from 'react';
import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    FormGroup,
    Input,
    Label,
    Form
} from 'reactstrap';
import {HandleKeyPressTextoNumeros} from '../../utils/utilsFunctions';

class TextoBuzonModal extends React.Component {
    state = {
        textoBuzon: ''
    }

    HandleKeyPressTextoNumeros = (event) => {
        if (!HandleKeyPressTextoNumeros(event)) {
            event.preventDefault();
        }
    }

    handleChange = (event) => {
        let value = event.target.value;
        this.setState({ [event.target.id]: value });
    }

    render() {
        const { open, closeModal, handleClickEnviarTexto } = this.props;
        const { textoBuzon } = this.state;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    toggle={closeModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={closeModal}>¿Qué llegó?</ModalHeader>
                    <Form>
                        <ModalBody>
                            <FormGroup>
                                <Label for={textoBuzon}>Resuma lo que llegó al buzón</Label>
                                <Input required id='textoBuzon'
                                    onKeyPress={this.HandleKeyPressTextoNumeros}
                                    onChange={this.handleChange}
                                    value={textoBuzon}
                                    placeholder="Ingrese el resumen"
                                    type='text'
                                    autoComplete="off" />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <FormGroup>

                                <Button color="primary" value={textoBuzon} onClick={handleClickEnviarTexto}>
                                    Enviar
            </Button>{' '}</FormGroup>

                        </ModalFooter>
                    </Form>
                </Modal>
            </Fragment>
        );
    }
}

export default TextoBuzonModal;
