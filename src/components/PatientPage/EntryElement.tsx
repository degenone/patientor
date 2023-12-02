import { Grid } from "@mui/material";
import { Entry } from "../../types";

interface Props {
    entry: Entry;
}

const EntryElement = ({ entry }: Props) => {
  return (
    <Grid item xs={12}>
      <p>{entry.date} &mdash; <i>{entry.description}</i></p>
      {entry.diagnosisCodes && (
        <ul>
          {entry.diagnosisCodes.map((code) => <li key={code}>{code}</li>)}
        </ul>
      )}
    </Grid>
  );
};

export default EntryElement;
