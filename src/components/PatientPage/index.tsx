import { useEffect, useState } from "react";
import { Gender, Patient } from "../../types";
import { useMatch } from "react-router-dom";
import patientService from "../../services/patients";
import axios from "axios";
import { Grid, Typography } from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Female';
import { assertNever } from "../../utlis";
import EntryElement from "./EntryElement";

interface Props {
  getDiagnosisName: (code: string) => string;
}

const PatientPage = ({ getDiagnosisName }: Props) => {
  const [patient, setPatient] = useState<Patient>();

  const match = useMatch('/patients/:id');
  useEffect(() => {
    const fetchPatient = async (patientId: string) => {
      try {
        const patient = await patientService.getById(patientId);
        setPatient(patient);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error(error.message);
        } else {
          console.log('[ERR]', error);
        }
      }
    };
    if (match && match.params.id) {
      fetchPatient(match.params.id);
    }
  }, [match]);

  if (!patient) {
    return (
      <div className="app">
        <Typography variant="h5">Patient not found!</Typography>
      </div>
    );
  }

  const genderIcon = () => {
    switch (patient.gender) {
      case Gender.Male:
        return <MaleIcon />;
      case Gender.Female:
        return <FemaleIcon />;
      case Gender.Other:
        return <Typography>Gender: Other</Typography>;
      default:
        assertNever(patient.gender);
        break;
    }
  };
  
  return (
    <div className="app">
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h5" align="center">Patient information</Typography>
        </Grid>
        <Grid item xs={2}><Typography>Name</Typography></Grid>
        <Grid item xs={2}>
          <Typography>{patient.name}</Typography>
        </Grid>
        <Grid item xs={8}>
          {genderIcon()}
        </Grid>
        <Grid item xs={2}><Typography>SSN</Typography></Grid>
        <Grid item xs={10}>
          <Typography>{patient.ssn}</Typography>
        </Grid>
        <Grid item xs={2}><Typography>Occupation</Typography></Grid>
        <Grid item xs={10}>
          <Typography>{patient.occupation}</Typography>
        </Grid>
        {(patient.entries.length > 0) && (
          <>
            <Grid item xs={12}>
              <Typography variant="h6">Entries</Typography>
            </Grid>
            {patient.entries.map((entry) => (
              <EntryElement
                key={entry.id}
                entry={entry}
                getDiagnosisName={getDiagnosisName} />
            ))}
          </>
        )}
      </Grid>
    </div>
  );
};

export default PatientPage;
