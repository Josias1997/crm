import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import axios from "./../../../../util/instanceAxios";
import Table from "./Table";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = (theme) => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "33.33%",
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
});

class ControlledExpansionPanels extends Component {
  state = {
    expanded: null,
    payments: [],
    loading: false,
    error: null,
  };

  handleChange = (panel) => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  componentDidMount() {
    this.setState({
      loading: true,
    });
    axios
      .get(`/api/client/payments/${this.props.id}`)
      .then(({ data }) => {
        this.setState({
          payments: data.payments,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: error,
          loading: false,
        });
      });
  }

  render() {
    const { classes, name } = this.props;
    const { expanded, payments, loading, error } = this.state;

    const columns = ["Montant", "Date", "Statut"];

    return (
      <div className={classes.root}>
        <ExpansionPanel
          expanded={expanded === "panel1"}
          onChange={this.handleChange("panel1")}
        >
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>{name}</Typography>
            <Typography className={classes.secondaryHeading}>
              Détails Paiements
            </Typography>
          </ExpansionPanelSummary>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <ExpansionPanelDetails>
              {payments.length === 0 ? (
                <Typography>
                  Aucun paiement n'a été enregistré pour le moment pour {name}
                </Typography>
              ) : (
                <Table columns={columns} rows={payments} />
              )}
            </ExpansionPanelDetails>
          )}
        </ExpansionPanel>
      </div>
    );
  }
}

ControlledExpansionPanels.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ControlledExpansionPanels);
