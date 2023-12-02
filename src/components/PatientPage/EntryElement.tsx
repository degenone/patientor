import { Grid } from "@mui/material";
import { Entry } from "../../types";

interface Props {
    entry: Entry;
    getDiagnosisName: (code: string) => string;
  }

const EntryElement = ({ entry, getDiagnosisName }: Props) => {
  return (
    <Grid item xs={12}>
      <p>{entry.date} &mdash; <i>{entry.description}</i></p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => <li key={code}>{code} &mdash; {getDiagnosisName(code)}</li>)}
        </ul>
      )}
    </Grid>
  );
};

export default EntryElement;
