import React, { Fragment } from 'react';
import { MdError, MdInfo } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { connect } from 'react-redux';
import { Form, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import { ActualizarPagos, GetPagos } from '../../api/api';
import { ConsultarEstadoTransaccion } from '../../api/apiClickingPay';
import { SetShowSpinner } from '../../reducers/actions/HorizontalProperties';
import PagosPendientesTabla from '../PagosPendientesTabla';


class TerminosCondicionesModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }

    }
    
    render() {
        const { open, handleCloseModal } = this.props;
        return (
            <Fragment>
                <Modal
                    isOpen={open}
                    toggle={handleCloseModal}
                    className={this.props.className}
                    centered>
                    <ModalHeader toggle={handleCloseModal}>Terminos y condiciones</ModalHeader>
                    <Form >
                        <ModalBody>
                            <div style={{ fontWeight: 'normal' }}>
                                <p align="center" style={{ textAlign: 'center' }}><strong>CONTRATO DE PRESTACI&Oacute;N DE SERVICIO DE FACTURACI&Oacute;N ELECTRONICA</strong></p>

                                <p style={{ textAlign: 'justify' }}></p>

                                <p style={{ textAlign: 'justify' }}>CONTRATO DE PRESTACION DE SERVICIOS DE FACTURACION ELECTRONICA, en adelante EL CONTRATO que celebran, por una parte <strong>TECHNOLOGY SOLUTIONS FACTORY S.A.S </strong>en adelante <strong>TECNOFACTOR </strong>a trav&eacute;s de su representante legal, <strong>RICARDO ERNESTO YEPES MUNERA</strong> y por otra parte EL CLIENTE (Usuario, persona f&iacute;sica o moral que registro sus datos en el portal <a href="http://www.portalfactura.com">www.portalfactura.com</a> , y conjuntamente, las &quot;Partes&quot; e indistintamente una &quot;Parte&quot;, al tenor de las siguientes declaraciones y cl&aacute;usulas:</p>

                                <p style={{ textAlign: 'justify' }}><strong>DECLARACIONES</strong></p>

                                <p style={{ textAlign: 'justify' }}>1. Declara que:</p>

                                <p style={{ textAlign: 'justify' }}>a) <strong>TECNOFACTOR </strong>es una Sociedad debidamente constituida de conformidad con las leyes de Colombia, identificado con el Nit 900.063.400-8, contando su representante legal con las facultades suficientes para celebrar este Contrato.</p>

                                <p style={{ marginBottom: '10.0pt', textAlign: 'justify' }}>b) La compa&ntilde;&iacute;a <strong>DOMINA ENTREGA TOTAL SAS </strong>es una sociedad debidamente constituida de conformidad con las leyes de Colombia, identificado con el Nit 800.088.155-3 y quien es agente autorizado por La Dian mediante resoluci&oacute;n 005635 del 04 de agosto de 2017.</p>

                                <p style={{ textAlign: 'justify' }}>c) <strong>TECNOFACTOR </strong>se encuentra autorizado por la compa&ntilde;&iacute;a <strong>DOMINA ENTREGA TOTAL SAS</strong> como canal comercial y tecnol&oacute;gico para que pueda comercializar y prestar los servicios de Facturaci&oacute;n Electr&oacute;nica a trav&eacute;s de la plataforma denominada <a href="http://www.portalfactura.com">www.portalfactura.com</a>.</p>

                                <p style={{ textAlign: 'justify' }}>d) <a href="http://www.portalfactura.com">www.portalfactura.com</a> es <span style={{ letterSpacing: '0.25pt' }}>una plataforma Web que posibilita el envio de documentos tributarios electr&oacute;nicos a trav&eacute;s de un proveedor de servicios tecnologicos autorizado por la DIAN, en el caso de las facturas, d&aacute;ndoles la misma validez legal de una factura f&iacute;sica al cumplir con el decreto 2242 de 2015, la resoluci&oacute;n 019 de febrero de 2016 y los anexos t&eacute;cnicos definidos por la DIAN.</span></p>

                                <p style={{ textAlign: 'justify' }}>2. Declara el Cliente que:</p>

                                <p style={{ textAlign: 'justify' }}>a) Es una persona natural o jur&iacute;dica debidamente constituida de conformidad con las leyes de Colombia, contando su representante legal con las facultades suficientes para celebrar &eacute;ste Contrato, Domiciliado y residenciado e identificado tributariamente tal c&oacute;mo lo indica en el formulario de registro de usuarios dispuesto en <a href="http://www.portalfactura.com">www.portalfactura.com</a>.</p>

                                <p style={{ textAlign: 'justify' }}>b) Requiere que <strong>TECNOFACTOR</strong> le preste los servicios de facturaci&oacute;n electr&oacute;nica a trav&eacute;s de la plataforma Web denominada <a href="http://www.portalfactura.com">www.portalfactura.com</a> con el fin de dar cabal cumplimiento <span style={{ letterSpacing: '0.25pt' }}>con el decreto 2242 de 2015, la resoluci&oacute;n 019 de febrero de 2016 y los anexos t&eacute;cnicos definidos por la DIAN.</span></p>

                                <p style={{ textAlign: 'justify' }}>En virtud de las declaraciones anteriores, las Partes convienen sujetarse a lo dispuesto en las siguientes cl&aacute;usulas.</p>

                                <p style={{ textAlign: 'justify' }}></p>

                                <p style={{ textAlign: 'justify' }}><strong>CLAUSULAS</strong></p>

                                <p style={{ textAlign: 'justify' }}>1. Objeto</p>

                                <p style={{ textAlign: 'justify' }}>La prestaci&oacute;n del Servicio de Facturaci&oacute;n Electr&oacute;nica a trav&eacute;s de la plataforma digital denominada <a href="http://www.portalfactura.com">www.portalfactura.com</a> <span style={{ letterSpacing: '0.25pt' }}>d&aacute;ndoles a las Facturas El&eacute;ctronicas la misma validez legal de una factura f&iacute;sica al cumplir con el decreto 2242 de 2015, la resoluci&oacute;n 019 de febrero de 2016 y los anexos t&eacute;cnicos definidos por la DIAN.</span></p>

                                <p style={{ textAlign: 'justify' }}>2. Precios.</p>

                                <p style={{ textAlign: 'justify' }}>a) EL CLIENTE pagar&aacute; a <strong>TECNOFACTOR</strong> como contraprestaci&oacute;n la suma COP$950 (Novecientos cincuenta pesos colombianos) por cada documento electr&oacute;nico emitido.</p>

                                <p style={{ textAlign: 'justify' }}>3. Forma de Pago.</p>

                                <p style={{ textAlign: 'justify' }}>a) La contraprestaci&oacute;n por el Servicio ser&aacute; exigible y pagadera por el Cliente por anticipado, conforme el paquete de transacciones que adquiera, al adquirir un paquete, podr&aacute; recibir transacciones extra sin costo adicional.</p>

                                <p style={{ textAlign: 'justify' }}>4. L&iacute;mites de Responsabilidad</p>

                                <p style={{ textAlign: 'justify' }}>a) <strong>TECNOFACTOR </strong>se compromete a cumplir las obligaciones como autorizado de <strong>DOMINA ENTREGA TOTAL SAS</strong> en su condici&oacute;n Proveedor Autorizado de Servicios de Facturaci&oacute;n Electr&oacute;nica establecidos en las normas especialmente el Decreto <span style={{ letterSpacing: '0.25pt' }}>2242 de 2015, la resoluci&oacute;n 019 de febrero de 2016 y los anexos t&eacute;cnicos definidos por la DIAN.</span> </p>

                                <p style={{ textAlign: 'justify' }}>b) El Cliente se obliga a cumplir con las obligaciones fiscales, las relativas a la facturaci&oacute;n electr&oacute;nica en especial las establecidas en el Decreto <span style={{ letterSpacing: '0.25pt' }}>2242 de 2015, la resoluci&oacute;n 019 de febrero de 2016 y los anexos t&eacute;cnicos definidos por la DIAN</span> y las adquiridas con la aceptaci&oacute;n de la prestaci&oacute;n del servici&oacute; de facturaci&oacute;n electr&oacute;nica por parte de <strong>TECNOFACTOR </strong>a trav&eacute;s de la plataforma digital denominada <a href="http://www.portalfactura.com">www.portalfactura.com</a></p>

                                <p style={{ textAlign: 'justify' }}>c) El obligado a facturar y el adquirente de las facturas electr&oacute;nicas, son los responsables frente a la DIAN y por ende responden por las obligaciones inherentes a su calidad. Es decir que <strong>TECNOFACTOR</strong>, no tendr&aacute; que responder frente a la DIAN por las obligaciones propias de sus clientes con respecto al deber de facturar, sin perjuicio de la responsabilidad contractual que pueda llegar a existir por alg&uacute;n tipo de incumplimiento de las obligaciones de <strong>TECNOFACTOR </strong>con sus clientes.</p>

                                <p style={{ textAlign: 'justify' }}>5. Uso del Sistema.</p>

                                <p style={{ textAlign: 'justify' }}>a) El Cliente reconoce y acepta que los servicios contenidos en el presente contrato se prestan a trav&eacute;s del Sistema, cuyo uso se pone a disposici&oacute;n del Cliente en el Sitio Web bajo el URL <a href="http://www.portalfactura.com">www.portalfactura.com</a> el cual cumple con todos los requisitos se&ntilde;alados en las disposiciones legales para emitir Facturas Electr&oacute;nicas. As&iacute; mismo acepta que con la creaci&oacute;n del Usuario y la contrase&ntilde;a la cual le permitir&aacute; acceder al sistema se est&aacute; dando cumplimiento al art. 7 de la Ley 527 de 199 respecto a la firma digital.</p>

                                <p style={{ textAlign: 'justify' }}>b) Las Partes convienen en que para todo lo relacionado con la operaci&oacute;n de la plataforma digital denominada <a href="http://www.portalfactura.com">www.portalfactura.com</a>, <strong>TECHNOLOGY SOLUTIONS FACTORY S.A.S &ldquo;TECNOFACTOR SAS&rdquo; </strong>proporcionar&aacute; al Cliente las reglas vigentes que estar&aacute;n en el manual que para ese efecto mantenga publicado dentro del Sitio Web.</p>

                                <p style={{ textAlign: 'justify' }}>c) <strong>TECNOFACTOR </strong>podr&aacute; modificar dichos t&eacute;rminos y condiciones de uso del Sistema y el Sitio Web cuando <strong>TECNOFACTOR </strong>lo crea conveniente, buscando no afectar al Cliente en sus procedimientos de trabajo, o bien cuando as&iacute; lo marque la ley. Dichos cambios podr&aacute;n realizarse por <strong>TECNOFACTOR </strong>sin previo aviso al Cliente, cambios que incluyen en forma ejemplificativa mas no limitativa, cambios y mejoras al sistema, cambio de dise&ntilde;os y colores, organizaci&oacute;n de funciones, agregar nuevos servicios, cambios a los procedimientos de emisi&oacute;n y/o cancelaci&oacute;n de otras operaciones.</p>

                                <p style={{ textAlign: 'justify' }}>6. Conservaci&oacute;n de Base de Datos ante Caso Fortuito o de Fuerza Mayor.</p>

                                <p style={{ textAlign: 'justify' }}>En caso de que <strong>TECNOFACTOR </strong>no pueda prestar los servicios contenidos en el servicio por m&aacute;s de 15 (quince) d&iacute;as naturales consecutivos con motivo de casos fortuitos, fuerza mayor, o en general por causas no atribuibles a <strong>TECNOFACTOR</strong>, <strong>TECNOFACTOR </strong>tan pronto sea posible devolver&aacute; al Cliente su Base de Datos, salvo que el Cliente decida que <strong>TECNOFACTOR </strong>contin&uacute;e conserv&aacute;ndola. El Cliente tendr&aacute; 30 (treinta) d&iacute;as naturales a partir del siguiente d&iacute;a al que se haya suspendido el servicio, para solicitar la devoluci&oacute;n de su Base de Datos a<strong> TECNOFACTOR</strong>. Transcurrido dicho plazo, se entender&aacute; que el Cliente ha solicitado a<strong> TECNOFACTOR </strong>que conserve dicha Base de Datos hasta nuevo aviso.</p>

                                <p style={{ textAlign: 'justify' }}>7. Confidencialidad y Protecci&oacute;n de Datos.</p>

                                <p style={{ textAlign: 'justify' }}>Mediante la celebraci&oacute;n del presente contrato las partes asumen la obligaci&oacute;n constitucional, legal y jurisprudencial de proteger los datos personales a los que accedan con ocasi&oacute;n a &eacute;ste contrato, por lo tanto se obligan a adoptar las medidas que le permitan dar cumplimiento a lo dispuesto por las leyes 1266 de 2008, 1581 de 2012 y el decreto 1377 de 2013, decreto 886 de 2014, y cualquier otra norma que las modifique o sustituya. Como consecuencia de esta obligaci&oacute;n legal, deber&aacute;n adoptar, entre otras las medidas de seguridad para garantizar que este tipo de informaci&oacute;n no ser&aacute; usada, comercializada, cedida, transferida y/o no ser&aacute; sometida a cualquier otro tratamiento contrario a la finalidad comprendida en lo dispuesto en el objeto del presente contrato. La parte que incumpla con lo ac&aacute; estipulado indemnizar&aacute; los perjuicios que llegue a causar a la otra parte como resultado del incumplimiento de las leyes 1266 de 2008 y 1581 de 2012 y dem&aacute;s normas aplicables al tratamiento de la informaci&oacute;n personal, as&iacute; como por las sanciones que llegaren a imponerse por violaci&oacute;n de la misma. Las partes reconocen el derecho que tienen los titulares de la informaci&oacute;n, por tanto es obligaci&oacute;n de las partes de informar una a la otra acerca de cualquier sospecha de perdida, fuga o ataque contra la informaci&oacute;n personal a la que ha accedido y/o trata con ocasi&oacute;n de este contrato, aviso que deber&aacute; dar una vez tenga conocimiento de tales eventualidades. El incumplimiento de las obligaciones derivadas de esta cl&aacute;usula, se considera como un incumplimiento grave por los riesgos legales que conlleva el debido tratamiento por los datos personales y, en consecuencia ser&aacute; considerada como justa causa para la terminaci&oacute;n del contrato. Adicionalmente la parte que incumpla ser&aacute; llamada en garant&iacute;a cuando quiera que terceros presenten o interpongan alguna reclamaci&oacute;n o requerimiento por lo ac&aacute; establecido.</p>

                                <p style={{ textAlign: 'justify' }}>8. Vigencia y Terminaci&oacute;n</p>

                                <p style={{ textAlign: 'justify' }}>a) El presente Contrato se celebra por tiempo indefinido.</p>

                                <p style={{ textAlign: 'justify' }}>b) En caso de rescisi&oacute;n de este Contrato, el cliente deber&aacute; haber pagado a <strong>TECNOFACTOR</strong> la Contraprestaci&oacute;n generada hasta esa fecha y cumplido con las dem&aacute;s obligaciones a su cargo bajo este Contrato.</p>

                                <p style={{ textAlign: 'justify' }}>c) No obstante lo anterior, cualquiera de las partes (la &quot;Parte Afectada&quot;) podr&aacute; rescindir de pleno derecho este Contrato, sin necesidad de declaraci&oacute;n judicial, mediante simple aviso por escrito o v&iacute;a correo electr&oacute;nico dirigido a la otra Parte, en caso de que la otra Parte incumpla (la &quot;Parte Incumplida&quot;) con cualquiera de sus obligaciones establecidas en este Contrato o en los t&eacute;rminos y condiciones de uso del Sitio Web. En este caso la Parte Incumplida tendr&aacute; un plazo de 15 (quince) d&iacute;as naturales siguientes al aviso de la Parte Afectada para subsanar su incumplimiento. Una vez transcurrido dicho plazo sin que la Parte Incumplida hubiere remediado su incumplimiento a satisfacci&oacute;n de <strong>TECNOFACTOR</strong>, la rescisi&oacute;n de este contrato operar&aacute; de forma autom&aacute;tica.</p>

                                <p style={{ textAlign: 'justify' }}>9. Notificaciones</p>

                                <p style={{ textAlign: 'justify' }}>a) En caso de recisi&oacute;n del presente contrato por parte de &quot;El cliente&quot;, no ser&aacute; reembolsable cantidad alguna pagada anticipadamente a <strong>TECNOFACTOR</strong> por ning&uacute;n concepto.</p>

                                <p style={{ textAlign: 'justify' }}>b) Cualquier aviso, requerimiento, notificaci&oacute;n y dem&aacute;s comunicaciones relativas a este Contrato deber&aacute; ser por escrito enviado v&iacute;a correo electr&oacute;nico. Dichas comunicaciones surtir&aacute;n sus efectos en la fecha en que hayan sido registrada por los servidores de correo electr&oacute;nico de <strong>TECNOFACTOR </strong>y/o del Cliente.</p>

                                <p style={{ textAlign: 'justify' }}>Las comunicaciones v&iacute;a correo electr&oacute;nico deber&aacute;n enviarse <a href="mailto:portal.factura@tecnofactor.com">portal.factura@tecnofactor.com</a> si es a <strong>TECNOFACTOR</strong>, Si es dirigida al CLIENTE, se enviar&aacute; a la direcci&oacute;n de correo electr&oacute;nico registrada en <a href="http://www.portalfactura.com">www.portalfactura.com</a></p>

                                <p style={{ textAlign: 'justify' }}>10. Acuerdo &Uacute;nico y Modificaciones.</p>

                                <p style={{ textAlign: 'justify' }}>a) Este Contrato y sus anexos contienen la totalidad del acuerdo entre las Partes formando en conjunto un solo instrumento, raz&oacute;n por la cual las Partes dejan sin efecto legal alguno cualquier otro acuerdo legal o escrito que hayan acordado o suscrito con fecha anterior a la fecha de celebraci&oacute;n del mismo.</p>

                                <p style={{ textAlign: 'justify' }}>b) Este contrato s&oacute;lo podr&aacute; ser modificado mediante convenio escrito firmado por las Partes, la cual se entender&aacute; con la aceptaci&oacute;n de las modificaciones de acuerdo al art. 7 de la Ley 527 de 199 respecto a la firma digital.</p>

                                <p style={{ textAlign: 'justify' }}>11. Ley Aplicable y Jurisdicci&oacute;n.</p>

                                <p style={{ marginBottom: '12.0pt', textAlign: 'justify' }}><strong>TECNOFACTOR</strong> y el CLIENTE convienen en que para todo lo relacionado con este Contrato se sujetan expresamente a las leyes vigentes y en especial acuerdan que cualquier controversia o reclamo que surja entre ellas con relaci&oacute;n al cumplimiento del objeto del presente contrato, su ejecuci&oacute;n, interpretaci&oacute;n, etc., que no pueda ser resuelto directamente por las partes dentro de los quince (15) d&iacute;as siguientes a la fecha en que una parte notifique a la otra por escrito de la controversia o reclamo, se someter&aacute; a la decisi&oacute;n de un &Aacute;rbitro cuyo fallo se proferir&aacute; como se describe a continuaci&oacute;n y que podr&aacute; ser solicitado por cualquiera de las partes, operando de acuerdo con las siguientes reglas:</p>

                                <ol>
                                    <li style={{ marginTop: '0cm', marginRight: '0cm', marginBottom: '12.0pt', textAlign: 'justify' }}>Constituci&oacute;n y nombramiento: Dicho &aacute;rbitro deber&aacute; ser un abogado con especial conocimiento de la materia objeto del litigio, el cual ser&aacute; nombrado, de com&uacute;n acuerdo, de las listas de &aacute;rbitros que posee la C&aacute;mara de Comercio de Medell&iacute;n; a falta de acuerdo por el Centro de Arbitraje y Conciliaci&oacute;n Mercantiles de la C&aacute;mara de Comercio de Medell&iacute;n.</li>
                                    <li style={{ marginTop: '0cm', marginRight: '0cm', marginBottom: '12.0pt', textAlign: 'justify' }}>Lugar: La solicitud de convocatoria se dirigir&aacute; al Centro de Arbitraje y Conciliaci&oacute;n de la C&aacute;mara de Comercio de Medell&iacute;n por cualquiera de las partes.</li>
                                    <li style={{ marginTop: '0cm', marginRight: '0cm', marginBottom: '12.0pt', textAlign: 'justify' }}>Decisi&oacute;n: El &aacute;rbitro fallar&aacute; en derecho, no obstante, podr&aacute; pedir conceptos t&eacute;cnicos de peritos especializados en la materia.</li>
                                </ol>

                            </div>
                        </ModalBody>
                        <ModalFooter>


                        </ModalFooter>
                    </Form>
                </Modal>

            </Fragment>
        );
    }
}

function mapStateToProps(state, props) {
    return {
    }
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(TerminosCondicionesModal);
