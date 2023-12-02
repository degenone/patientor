import { Box, Card, CardContent, CardHeader, Grid, List, ListItem, Tooltip, Typography } from "@mui/material";
import WorkIcon from '@mui/icons-material/Work';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import { Entry } from "../../types";
import { assertNever } from "../../utlis";

interface Props {
    entry: Entry;
    getDiagnosisName: (code: string) => string;
  }

const EntryElement = ({ entry, getDiagnosisName }: Props) => {
  const { type } = entry;
  const favoriteColors = new Map<number, string>([
    [0, "green"], [1, "yellow"], [2, "firebric"], [3, "red"],
  ]);

  switch (type) {
    case "HealthCheck":
      return (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Date: ${entry.date}`}
              subheader={`Specialist: ${entry.specialist}`}
              avatar={
                <Tooltip title={"Health check"}>
                  <MonitorHeartIcon />
                </Tooltip>
              } />
            <CardContent>
              <Typography>{entry.description}</Typography>
              <FavoriteIcon style={{ color: favoriteColors.get(entry.healthCheckRating)}} />
              {entry.diagnosisCodes && (
                <List>
                  {entry.diagnosisCodes.map((code) => (
                    <ListItem key={code}>{code} &mdash; {getDiagnosisName(code)}</ListItem>)
                  )}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      );
    case "Hospital":
      return (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Date: ${entry.date}`}
              subheader={`Specialist: ${entry.specialist}`}
              avatar={
                <Tooltip title={"Hospital"}>
                  <LocalHospitalIcon />
                </Tooltip>
              } />
            <CardContent>
              <Typography>{entry.description}</Typography>
              {entry.healthCheckRating && (
                <FavoriteIcon style={{ color: favoriteColors.get(entry.healthCheckRating)}} />
              )}
              {entry.diagnosisCodes && (
                <List>
                  {entry.diagnosisCodes.map((code) => (
                    <ListItem key={code}>{code} &mdash; {getDiagnosisName(code)}</ListItem>)
                  )}
                </List>
              )}
              <Typography>Discharged on {entry.discharge.date} &mdash; <i>{entry.discharge.criteria}</i></Typography>
            </CardContent>
          </Card>
        </Grid>
      );
    case "OccupationalHealthcare":
      return (
        <Grid item xs={12}>
          <Card>
            <CardHeader
              title={`Date: ${entry.date}`}
              subheader={`Specialist: ${entry.specialist}`}
              avatar={
                <Box>
                  <Tooltip title={"Occupational healthcare"}>
                    <WorkIcon />
                  </Tooltip>
                  <Typography>{entry.employerName}</Typography>
                </Box>
              } />
            <CardContent>
              <Typography>{entry.description}</Typography>
              {entry.healthCheckRating && (
                <FavoriteIcon style={{ color: favoriteColors.get(entry.healthCheckRating)}} />
              )}
              {entry.diagnosisCodes && (
                <List>
                  {entry.diagnosisCodes.map((code) => (
                    <ListItem key={code}>{code} &mdash; {getDiagnosisName(code)}</ListItem>)
                  )}
                </List>
              )}  
              {entry.sickLeave && (
                <Typography>Sick leave from {entry.sickLeave.startDate} to {entry.sickLeave.endDate}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      );
    default:
      assertNever(type);
      break;
  }
};

export default EntryElement;
