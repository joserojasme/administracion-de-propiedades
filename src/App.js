import { STATE_LOGIN, STATE_SIGNUP, STATE_FORGOT } from 'components/AuthForm';
import GAListener from 'components/GAListener';
import { EmptyLayout, LayoutRoute, MainLayout } from 'components/Layout';
import PageSpinner from 'components/PageSpinner';
import AuthPage from 'pages/AuthPage';
import React from 'react';
import componentQueries from 'react-component-queries';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import './styles/reduction.scss';
import { withAuthenticator } from 'aws-amplify-react';
import AuthForm from './components/AuthForm';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './styles/theme';

const AlertPage = React.lazy(() => import('pages/AlertPage'));
const AuthModalPage = React.lazy(() => import('pages/AuthModalPage'));
const BadgePage = React.lazy(() => import('pages/BadgePage'));
const ButtonGroupPage = React.lazy(() => import('pages/ButtonGroupPage'));
const ButtonPage = React.lazy(() => import('pages/ButtonPage'));
const CardPage = React.lazy(() => import('pages/CardPage'));
const ChartPage = React.lazy(() => import('pages/ChartPage'));
const Home = React.lazy(() => import('pages/Home'));
const Comunicaciones = React.lazy(() => import('pages/Comunicaciones'));
const ComunicacionesPorteria = React.lazy(() => import('pages/ComunicacionesPorteria'));
const Perfil = React.lazy(() => import('pages/Perfil'));
const Facturas = React.lazy(() => import('pages/Facturas'));
const ResultadoPagos = React.lazy(() => import('pages/ResultadoPagos'));
const Administracion = React.lazy(() => import('pages/Administracion'));
const AdministrarPropiedadesHorizontales = React.lazy(() => import('pages/AdministrarPropiedadesHorizontales'));
const AdministrarPropiedades = React.lazy(() => import('pages/AdministrarPropiedades'));
const DropdownPage = React.lazy(() => import('pages/DropdownPage'));
const FormPage = React.lazy(() => import('pages/FormPage'));
const InputGroupPage = React.lazy(() => import('pages/InputGroupPage'));
const ModalPage = React.lazy(() => import('pages/ModalPage'));
const ProgressPage = React.lazy(() => import('pages/ProgressPage'));
const TablePage = React.lazy(() => import('pages/TablePage'));
const TypographyPage = React.lazy(() => import('pages/TypographyPage'));
const WidgetPage = React.lazy(() => import('pages/WidgetPage'));

const getBasename = () => {
  return `/${process.env.PUBLIC_URL.split('/').pop()}`;
};

class App extends React.Component {
  render() { 
    return (
      <BrowserRouter basename={getBasename()}>
        <GAListener>
          <Switch>
            <LayoutRoute
              exact
              path="/login"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_LOGIN} />
              )}
            />
            <LayoutRoute
              exact
              path="/signup"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_SIGNUP} />
              )}
            />
            <LayoutRoute
              exact
              path="/forgot"
              layout={EmptyLayout}
              component={props => (
                <AuthPage {...props} authState={STATE_FORGOT} />
              )}
            />
            
            <MainLayout breakpoint={this.props.breakpoint}>
            <MuiThemeProvider theme={theme}>
              <React.Suspense fallback={<PageSpinner />}>
                <Route exact path="/app" component={Home} />
                <Route exact path="/comunicaciones" component={Comunicaciones} />
                <Route exact path="/comunicaciones-porteria" component={ComunicacionesPorteria} />
                <Route exact path="/perfil" component={Perfil} />
                <Route exact path="/facturas" component={Facturas} />
                <Route exact path="/resultado-pagos" component={ResultadoPagos} />
                <Route exact path="/administracion" component={Administracion} />
                <Route exact path="/copropiedad" component={AdministrarPropiedadesHorizontales} />
                <Route exact path="/propiedades" component={AdministrarPropiedades} />
                
                <Route exact path="/login-modal" component={AuthModalPage} />
                <Route exact path="/buttons" component={ButtonPage} />
                <Route exact path="/cards" component={CardPage} />
                <Route exact path="/widgets" component={WidgetPage} />
                <Route exact path="/typography" component={TypographyPage} />
                <Route exact path="/alerts" component={AlertPage} />
                <Route exact path="/tables" component={TablePage} />
                <Route exact path="/badges" component={BadgePage} />
                <Route exact path="/button-groups" component={ButtonGroupPage} />
                <Route exact path="/dropdowns" component={DropdownPage} />
                <Route exact path="/progress" component={ProgressPage} />
                <Route exact path="/modals" component={ModalPage} />
                <Route exact path="/forms" component={FormPage} />
                <Route exact path="/input-groups" component={InputGroupPage} />
                <Route exact path="/charts" component={ChartPage} />
              </React.Suspense>
              </MuiThemeProvider>
            </MainLayout>

            <Redirect to={{ pathname: '/login' }} />
          </Switch>
        </GAListener>
      </BrowserRouter>

    );
  }
}

const query = ({ width }) => {
  if (width < 575) {
    return { breakpoint: 'xs' };
  }

  if (576 < width && width < 767) {
    return { breakpoint: 'sm' };
  }

  if (768 < width && width < 991) {
    return { breakpoint: 'md' };
  }

  if (992 < width && width < 1199) {
    return { breakpoint: 'lg' };
  }

  if (width > 1200) {
    return { breakpoint: 'xl' };
  }

  return { breakpoint: 'xs' };
};

export default componentQueries(query)(App);
