import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AdministrarNoticias from '../components/AdministrarNoticias';
import AdministrarEventos from '../components/AdministrarEventos';
import AdministrarZonasComunes from '../components/AdministrarZonasComunes';
import AdministrarEmpleados from '../components/AdministrarEmpleados';
import AdministrarPropiedadesHorizontales from './AdministrarPropiedadesHorizontales';

const useStyles = makeStyles(theme => ({
  root: {
    width: '90%',
    marginLeft:'auto',
    marginRight: 'auto'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
    fontWeight: 'bold'
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function Administracion() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = panel => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <ExpansionPanel style={{display:'none'}} expanded={expanded === 'PropiedadHorizontal'} onChange={handleChange('PropiedadHorizontal')}>
        <ExpansionPanelSummary 
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Propiedad horizontal</Typography>
          <Typography className={classes.secondaryHeading}>Administrar propiedad horizontal</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          <AdministrarPropiedadesHorizontales/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel style={{display:'none'}} expanded={expanded === 'Propiedades'} onChange={handleChange('Propiedades')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Propiedades</Typography>
          <Typography className={classes.secondaryHeading}>Administrar Propiedades</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          <div>¡PROXIMAMENTE!</div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'Noticias'} onChange={handleChange('Noticias')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Noticias</Typography>
          <Typography className={classes.secondaryHeading}>Administrar noticias</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails >
          <AdministrarNoticias/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'Eventos'} onChange={handleChange('Eventos')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Eventos</Typography>
          <Typography className={classes.secondaryHeading}>Administrar eventos</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AdministrarEventos/>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'Zonas'} onChange={handleChange('Zonas')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Zonas comunes</Typography>
          <Typography className={classes.secondaryHeading}>
            Administrar zonas comunes
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AdministrarZonasComunes />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ExpansionPanel expanded={expanded === 'Personal'} onChange={handleChange('Personal')}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Empleados</Typography>
          <Typography className={classes.secondaryHeading}>
            Administrar empleados
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AdministrarEmpleados />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  );
}