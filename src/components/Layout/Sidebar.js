import logoMiIncCortado from 'assets/img/logo/logo_miinc_cortado.png';
import sidebarBgImage from 'assets/img/sidebar/sidebar-4.jpg';
import SourceLink from 'components/SourceLink';
import React from 'react';
import {
  MdAccountCircle,
  MdArrowDropDownCircle,
  MdBorderAll,
  MdBrush,
  MdChromeReaderMode,
  MdDashboard,
  MdHome,
  MdExtension,
  MdGroupWork,
  MdInsertChart,
  MdKeyboardArrowDown,
  MdNotificationsActive,
  MdPages,
  MdRadioButtonChecked,
  MdSend,
  MdStar,
  MdTextFields,
  MdViewCarousel,
  MdViewDay,
  MdViewList,
  MdWeb,
  MdWidgets,
} from 'react-icons/md';
import { NavLink } from 'react-router-dom';
import {
  // UncontrolledTooltip,
  Collapse,
  Nav,
  Navbar,
  NavItem,
  NavLink as BSNavLink,
} from 'reactstrap';
import bn from 'utils/bemnames';

const sidebarBackground = {
  backgroundImage: `url("${sidebarBgImage}")`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
};

const navComponents = [
  { to: '/buttons', name: 'botones', exact: false, Icon: MdRadioButtonChecked },
  {
    to: '/button-groups',
    name: 'button groups',
    exact: false,
    Icon: MdGroupWork,
  },
  { to: '/forms', name: 'formularios', exact: false, Icon: MdChromeReaderMode },
  { to: '/input-groups', name: 'grupos entrada', exact: false, Icon: MdViewList },
  {
    to: '/dropdowns',
    name: 'dropdowns',
    exact: false,
    Icon: MdArrowDropDownCircle,
  },
  { to: '/badges', name: 'badges', exact: false, Icon: MdStar },
  { to: '/alerts', name: 'alerts', exact: false, Icon: MdNotificationsActive },
  { to: '/progress', name: 'progress', exact: false, Icon: MdBrush },
  { to: '/modals', name: 'modals', exact: false, Icon: MdViewDay },
];

const navContents = [
  { to: '/typography', name: 'typography', exact: false, Icon: MdTextFields },
  { to: '/tables', name: 'tables', exact: false, Icon: MdBorderAll },
];

const pageContents = [
  { to: '/login', name: 'login / signup', exact: false, Icon: MdAccountCircle },
  {
    to: '/login-modal',
    name: 'login modal',
    exact: false,
    Icon: MdViewCarousel,
  },
];

const navItems = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  { to: '/perfil', name: 'Mi perfil', exact: false, Icon: MdAccountCircle },
  { to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
 // { to: '/zonas', name: 'Zonas', exact: false, Icon: MdWidgets },
  { to: '/comunicaciones', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

const navItemsPortero = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  //{ to: '/perfil', name: 'Perfil', exact: false, Icon: MdAccountCircle },
  //{ to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
 // { to: '/zonas', name: 'Zonas', exact: false, Icon: MdWidgets },
  { to: '/comunicaciones-porteria', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

const navItemsAdministradores = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  { to: '/perfil', name: 'Mi perfil', exact: false, Icon: MdAccountCircle },
  { to: '/copropiedad', name: 'Copropiedad', exact: false, Icon: MdDashboard },
  { to: '/propiedades', name: 'Propiedades', exact: false, Icon: MdDashboard },
  { to: '/administracion', name: 'Administrar', exact: false, Icon: MdWidgets },
  //{ to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
  { to: '/comunicaciones-porteria', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

// const navItems = [
//   { to: '/app', name: 'Home', exact: true, Icon: MdHome },
//   { to: '/cards', name: 'Perfil', exact: false, Icon: MdAccountCircle },
//   { to: '/charts', name: 'Facturas', exact: false, Icon: MdInsertChart },
//   { to: '/widgets', name: 'Zonas', exact: false, Icon: MdWidgets },
//   { to: '/widgets', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
// ];

const navItemsMobile = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  { to: '/perfil', name: 'Mi perfil', exact: false, Icon: MdAccountCircle },
  { to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
  //{ to: '/zonas', name: 'Zonas', exact: false, Icon: MdWidgets },
  { to: '/comunicaciones', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

const navItemsMobilePorteria = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  //{ to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
  //{ to: '/zonas', name: 'Zonas', exact: false, Icon: MdWidgets },
  { to: '/comunicaciones-porteria', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

const navItemsMobileAdministradores = [
  { to: '/app', name: 'Home', exact: true, Icon: MdHome },
  { to: '/perfil', name: 'Mi perfil', exact: false, Icon: MdAccountCircle },
  { to: '/copropiedad', name: 'Copropiedad', exact: false, Icon: MdDashboard },
  { to: '/administracion', name: 'Administrar', exact: false, Icon: MdWidgets },
  //{ to: '/facturas', name: 'Facturas', exact: false, Icon: MdInsertChart },
  { to: '/comunicaciones-porteria', name: 'Comunicaciones', exact: false, Icon: MdNotificationsActive },
];

const bem = bn.create('sidebar');

class Sidebar extends React.Component {
  state = {
    isOpenComponents: true,
    isOpenContents: true,
    isOpenPages: true,
    sideBarVisible: true,
  };

  componentDidMount() {
    this.checkBreakpoint(this.props.breakpoint);
  }

  componentWillReceiveProps({ breakpoint }) {
    if (breakpoint !== this.props.breakpoint) {
      this.checkBreakpoint(breakpoint);
    }
  }

  checkBreakpoint(breakpoint) {
    switch (breakpoint) {
      case 'xs':
      case 'sm':
      case 'md':
        return this.setState({ sideBarVisible: false }, () => { })

      case 'lg':
      case 'xl':
      default:
        this.setState({ sideBarVisible: true }, () => { })
    }
  }


  handleClick = name => () => {
    this.setState(prevState => {
      const isOpen = prevState[`isOpen${name}`];

      return {
        [`isOpen${name}`]: !isOpen,
      };
    });
  };

  render() {
    const { sideBarVisible } = this.state;
    const {userAttributes} = this.props;
    
    return (
      <aside className={bem.b()} data-image={sidebarBgImage}>
        <div className={bem.e('background')} style={sidebarBackground} />
        <div className={bem.e('content')}>
          <Navbar>
            <SourceLink className="navbar-brand">
              <img
                src={logoMiIncCortado}
                width="180"
                height="100"
                alt=""
                className="pr-2"
              />
              <span style={{display:'none'}} className="text-white">
                Mi Inc
              </span>
            </SourceLink>
          </Navbar>
          <Nav vertical>
            {userAttributes.grupo !== undefined &&
              userAttributes.grupo[0] === "porteria" &&
            navItemsPortero.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="inactive"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))
            }

          {userAttributes.grupo !== undefined &&
              userAttributes.grupo[0] === "administradores" &&
            navItemsAdministradores.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="inactive"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>
            ))
            }

            {userAttributes.grupo === undefined &&
            navItems.map(({ to, name, exact, Icon }, index) => (
              <NavItem key={index} className={bem.e('nav-item')}>
                <BSNavLink
                  id={`navItem-${name}-${index}`}
                  className="text-uppercase"
                  tag={NavLink}
                  to={to}
                  activeClassName="inactive"
                  exact={exact}
                >
                  <Icon className={bem.e('nav-item-icon')} />
                  <span className="">{name}</span>
                </BSNavLink>
              </NavItem>

            ))}

           
            <div style={{ display: 'none' }}>
              <NavItem
                className={bem.e('nav-item')}
                onClick={this.handleClick('Components')}
              >
                <BSNavLink className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdExtension className={bem.e('nav-item-icon')} />
                    <span className=" align-self-start">Components</span>
                  </div>
                  <MdKeyboardArrowDown
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenComponents
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform',
                    }}
                  />
                </BSNavLink>
              </NavItem>

              <Collapse isOpen={this.state.isOpenComponents}>
                {navComponents.map(({ to, name, exact, Icon }, index) => (
                  <NavItem key={index} className={bem.e('nav-item')}>
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                    >
                      <Icon className={bem.e('nav-item-icon')} />
                      <span className="">{name}</span>
                    </BSNavLink>
                  </NavItem>
                ))}
              </Collapse>

              <NavItem
                className={bem.e('nav-item')}
                onClick={this.handleClick('Contents')}
              >
                <BSNavLink className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdSend className={bem.e('nav-item-icon')} />
                    <span className="">Contents</span>
                  </div>
                  <MdKeyboardArrowDown
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenContents
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform',
                    }}
                  />
                </BSNavLink>
              </NavItem>
              <Collapse isOpen={this.state.isOpenContents}>
                {navContents.map(({ to, name, exact, Icon }, index) => (
                  <NavItem key={index} className={bem.e('nav-item')}>
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                    >
                      <Icon className={bem.e('nav-item-icon')} />
                      <span className="">{name}</span>
                    </BSNavLink>
                  </NavItem>
                ))}
              </Collapse>

              <NavItem
                className={bem.e('nav-item')}
                onClick={this.handleClick('Pages')}
              >
                <BSNavLink className={bem.e('nav-item-collapse')}>
                  <div className="d-flex">
                    <MdPages className={bem.e('nav-item-icon')} />
                    <span className="">Pages</span>
                  </div>
                  <MdKeyboardArrowDown
                    className={bem.e('nav-item-icon')}
                    style={{
                      padding: 0,
                      transform: this.state.isOpenPages
                        ? 'rotate(0deg)'
                        : 'rotate(-90deg)',
                      transitionDuration: '0.3s',
                      transitionProperty: 'transform',
                    }}
                  />
                </BSNavLink>
              </NavItem>
              <Collapse isOpen={this.state.isOpenPages}>
                {pageContents.map(({ to, name, exact, Icon }, index) => (
                  <NavItem key={index} className={bem.e('nav-item')}>
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      className="text-uppercase"
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                    >
                      <Icon className={bem.e('nav-item-icon')} />
                      <span className="">{name}</span>
                    </BSNavLink>
                  </NavItem>
                ))}
              </Collapse>
            </div>
          </Nav>
          <div style={sideBarVisible === false ? { display: 'block' } : { display: 'none' }}>
            <nav className="navbar flex-nowrap fixed-bottom bg-gradient-theme-left border-0" >
            {userAttributes.grupo !== undefined &&
              userAttributes.grupo[0] === "porteria" &&
              navItemsMobilePorteria.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} style={{ listStyleType: 'none' }} className={bem.e('nav-item')} >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >

                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))
            }

              {userAttributes.grupo !== undefined &&
              userAttributes.grupo[0] === "administradores" &&
                navItemsMobileAdministradores.map(({ to, name, exact, Icon }, index) => (
                  <NavItem key={index} style={{ listStyleType: 'none' }} className={bem.e('nav-item')} >
                    <BSNavLink
                      id={`navItem-${name}-${index}`}
                      tag={NavLink}
                      to={to}
                      activeClassName="active"
                      exact={exact}
                    >

                      <Icon className={bem.e('nav-item-icon')} />
                    </BSNavLink>
                  </NavItem>
                ))
              }

            {userAttributes.grupo === undefined &&
              navItemsMobile.map(({ to, name, exact, Icon }, index) => (
                <NavItem key={index} style={{ listStyleType: 'none' }} className={bem.e('nav-item')} >
                  <BSNavLink
                    id={`navItem-${name}-${index}`}
                    tag={NavLink}
                    to={to}
                    activeClassName="active"
                    exact={exact}
                  >

                    <Icon className={bem.e('nav-item-icon')} />
                  </BSNavLink>
                </NavItem>
              ))
            }
            </nav>
          </div>

        </div>
      </aside>
    );
  }
}

export default Sidebar;
