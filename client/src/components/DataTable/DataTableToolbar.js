import React, {useState, useEffect} from "react";
import PropTypes from "prop-types";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";

let DataTableToolbar = props => {
  const {numSelected} = props;

  return (
    <Toolbar className="table-header">
      <div className="title">
        {numSelected > 0 ? (
          <Typography variant="subheading">{numSelected} selected</Typography>
        ) : (
          <Typography variant="title">{`${props.title} Table`}</Typography>
        )}
      </div>
      <div className="spacer"/>
      <div className="actions">
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete">
              <DeleteIcon/>
            </IconButton>
          </Tooltip>
        )}
      </div>
    </Toolbar>
  );
};

DataTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired
};

export default DataTableToolbar;