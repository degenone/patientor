import { useEffect, useState } from "react";
import { Diagnosis, EntryFromValues, Gender, Patient } from "../../types";
import { useMatch } from "react-router-dom";
import patientService from "../../services/patients";
import axios from "axios";
import { Alert, Button, Grid, Typography } from "@mui/material";
import FemaleIcon from '@mui/icons-material/Female';
import MaleIcon from '@mui/icons-material/Female';
import { assertNever } from "../../utlis";
import EntryElement from "./EntryElement";
import AddEntryModal from "../AddEntryModal";

interface Props {
  getDiagnosisName: (code: string) => string;
  diagnosis: Diagnosis[];
}

const PatientPage = ({ getDiagnosisName, diagnosis }: Props) => {

  const [patient, setPatient] = useState<Patient>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const match = useMatch('/patients/:id');
  useEffect(() => {
    const fetchPatient = async (patientId: string) => {
      try {
        const p = await patientService.getById(patientId);
        setPatient(p);
      } catch (e: unknown) {
        if (axios.isAxiosError(e)) {
          if (e?.response?.status && e?.response?.status === 404) {
            const message = e.response.statusText;
            console.error(message);
          } else {
            console.log('Unrecognized axios error', e);
            setError('Unrecognized axios error');
          }
        } else {
          console.log('Unknown error', e);
          setError("Unknown error");
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
        {error && <Alert severity="error">{error}</Alert>}
        <Typography variant="h5">Patient not found!</Typography>
      </div>
    );
  }

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFromValues) => {
    if (!patient || !patient.id) return;
    try {
      const p = await patientService.addEntry(patient.id, values);
      setPatient(p);
      setModalOpen(false);
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        if (e?.response?.data && typeof e?.response?.data === "string") {
          const message = e.response.data;
          console.error(message);
          setError(message);
        } else {
          setError("Unrecognized axios error");
        }
      } else {
        console.error("Unknown error", e);
        setError("Unknown error");
      }
    }
  };
  
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
      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        error={error}
        onSubmit={submitNewEntry}
        diagnosis={diagnosis} />
      <Button variant="contained" onClick={openModal} sx={{ marginBlockStart: '0.5rem' }}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;
