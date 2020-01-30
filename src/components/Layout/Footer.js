import React from 'react';

import { Navbar, Nav, NavItem } from 'reactstrap';

import SourceLink from 'components/SourceLink';

const Footer = () => {
  let year = new Date().getFullYear();
  return (
    <Navbar>
      <Nav navbar>
        <NavItem>
        © {year} by <SourceLink>Mi Inc</SourceLink> Todos los derechos reservados  
        </NavItem>
      </Nav>
    </Navbar>
  );
};

export default Footer;
