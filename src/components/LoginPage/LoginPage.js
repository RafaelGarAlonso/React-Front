import React, { useState } from 'react';
import { Container, Form, Row, Col, Button, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../auth/authContext';
import { types } from '../../types/types';
import { VerticalModal } from '../VerticalModal/VerticalModal';
import { userLoginFetch } from '../../services/GlobalServices';
import './LoginPage.css';

export const LoginPage = () => {

    const [modalTitle, setModalTitle] = React.useState('');
    const [modalText, setModalText] = React.useState('');
    const [modalShow, setModalShow] = React.useState(false);
    const navigate = useNavigate();
    const { dispatch } = useContext(AuthContext);
    const [ form, setForm ] = useState({});
    const [ errors, setErrors ] = useState({});

    const setField = (field, value) => {
        setForm( { ...form, [field]: value });
        if ( !!errors[field] ) setErrors({ ...errors, [field]: null });
    }

    const onFormSubmit = (e) => {
        e.preventDefault();
        const newErrors = findFormErrors();
        if ( Object.keys(newErrors).length > 0 ) {
            setErrors(newErrors);
        } else {
            userLoginFetch(form.email, form.password).then(resp => {
                if (resp.ok) {
                    const action = {
                        type: types.login,
                        payload: { name: resp.name }
                    }
                    
                    dispatch(action);
        
                    const lastPath = localStorage.getItem('lastPath') || '/dashboard';
        
                    navigate( lastPath, {
                        replace: true
                    });
                } else {
                    printModal({title: 'Error inesperado', text: resp.msg});
                }
            });
        }
    }

    const findFormErrors = () => {
        const { email, password } = form;
        const newErrors = {};
        const validateEmail = RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if ( !email || email === '' ) newErrors.email = 'Introduzca un correo electrónico';
        if ( !validateEmail.test(email)) newErrors.email = 'Introduzca un email válido';
        if ( !password || password === '' ) newErrors.password = 'Introduzca una contraseña';
        return newErrors;
    }

    const registerPageRedirect = () => {
        navigate('/registro', {
            replace: true
        });
    }

    const printModal = ({title, text}) => {
        setModalTitle(title);
        setModalText(text);
        setModalShow(true);
    }

    return (
        <Container fluid className="login-container background-access-container">
            <Form className="login-form"  onSubmit={ onFormSubmit }>
                <Stack gap={1} className="col-md-4 mx-auto login-form">

                    <Row className="mb-2">
                        <h1 className="mx-left">Acceso</h1>
                    </Row>

                    <Row className="mb-2">
                        <Form.Group as={Col} controlId="formGridEmail">
                            <Form.Label>Correo electrónico</Form.Label>
                            <Form.Control onChange={ e => setField('email', e.target.value) } 
                                          type="email"
                                          placeholder="Email" 
                                          isInvalid={ !!errors.email } />

                            <Form.Control.Feedback type='invalid'>
                                { errors.email }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Row className="mb-4">
                        <Form.Group as={Col} controlId="formGridPassword">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control onChange={ e => setField('password', e.target.value) } 
                                          type="password" 
                                          placeholder="Contraseña" 
                                          isInvalid={ !!errors.password } />

                            <Form.Control.Feedback type='invalid'>
                                { errors.password }
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>

                    <Button className="mx-auto button-login" 
                            variant="primary" 
                            type="submit">
                        Acceder
                    </Button>

                    <Row className="mt-4">
                        <div className="my-auto button-register">
                            ¿No tienes cuenta? 
                            <Button variant="link" 
                                    onClick= { registerPageRedirect }> REGISTRARSE 
                            </Button>
                        </div>
                    </Row>
    
                </Stack>
            </Form>

            <VerticalModal 
                show = { modalShow } 
                title = { modalTitle } 
                text = { modalText }
                onHide = { () => setModalShow(false) } 
            />

        </Container>
    )
}
