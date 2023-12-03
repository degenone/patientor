import { Box, Button, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent, TextField, Theme, Typography, useTheme } from "@mui/material";
import { Diagnosis, EntryFromValues } from "../../types";
import React, { useState } from "react";

interface Props {
  onSubmit: (values: EntryFromValues) => void;
  onCancel:() => void;
  diagnosis: Diagnosis[]
}

const getStyles = (code: string, diagnosisCodes: readonly string[], theme: Theme) => {
  return {
    fontWeight:
      diagnosisCodes.indexOf(code) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

const AddEntryForm = ({ onSubmit, onCancel, diagnosis }: Props) => {

  const theme = useTheme();
  const [type, setType] = useState<string>('HealthCheck');
  const [description, setDescription] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [specialist, setSpecialist] = useState<string>('');
  const [diagnosisCodes, setDiagnosisCodes] = useState<string[]>([]);
  const [rating, setRating] = useState<string>('');
  const [dischargeDate, setDischargeDate] = useState<string>('');
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<string>('');
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<string>('');
  const [employerName, setEmployerName] = useState<string>('');

  const addEntry = (e: React.SyntheticEvent) => {
    e.preventDefault();
    let entry: EntryFromValues;
    switch (type) {
      case 'HealthCheck':
        onSubmit({
          type: 'HealthCheck',
          description,
          date,
          specialist,
          diagnosisCodes,
          healthCheckRating: +rating,
        });
        break;
      case 'Hospital':
        entry = {
          type: 'Hospital',
          description,
          date,
          specialist,
          diagnosisCodes,
          discharge: {
            date: dischargeDate,
            criteria: dischargeCriteria,
          }
        };
        if (rating) {
          entry.healthCheckRating = +rating;
        }
        onSubmit(entry);
        break;
      case 'OccupationalHealthcare':
        entry = {
          type: 'OccupationalHealthcare',
          description,
          date,
          specialist,
          diagnosisCodes,
          employerName,
        };
        if (sickLeaveStartDate && sickLeaveEndDate) {
          entry.sickLeave = {
            startDate: sickLeaveStartDate,
            endDate: sickLeaveEndDate,
          };
        }
        if (rating) {
          entry.healthCheckRating = +rating;
        }
        onSubmit(entry);
        break;
      default:
        break;
    }
  };

  const handleCodeSelectChange = (e: SelectChangeEvent<typeof diagnosisCodes>) => {
    const {
      target: { value },
    } = e;
    if (!value) return;
    setDiagnosisCodes(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  return (
    <Box>
      <form onSubmit={addEntry} style={{ display: 'grid', gap: '0.5rem' }}>
        <FormControl fullWidth sx={{ marginBlockStart: '0.5rem' }}>
          <InputLabel id="type-select-label">Select entry type</InputLabel>
          <Select
            labelId="type-select-label"
            id="type-select"
            label="Select entry type"
            value={type}
            onChange={({ target: { value } }) => setType(value)}
          >
            <MenuItem value="HealthCheck">Health Check</MenuItem>
            <MenuItem value="Hospital">Hospital</MenuItem>
            <MenuItem value="OccupationalHealthcare">Occupational Healthcare</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Description"
          fullWidth
          required
          value={description}
          onChange={({ target: { value } }) => setDescription(value)} />
        <TextField
          type="date"
          label="Date"
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={({ target: { value } }) => setDate(value)} />
        <TextField
          label="Specialist"
          required
          fullWidth
          value={specialist}
          onChange={({ target: { value } }) => setSpecialist(value)} />
        <FormControl fullWidth required={type === 'HealthCheck'}>
          <InputLabel id="rating-select-label">Select health check rating</InputLabel>
          <Select
            labelId="rating-select-label"
            label="Select health check rating"
            value={rating}
            onChange={({ target: { value } }) => setRating(value)}
          >
            <MenuItem value=""></MenuItem>
            <MenuItem value="0">Healty</MenuItem>
            <MenuItem value="1">Low risk</MenuItem>
            <MenuItem value="2">High risk</MenuItem>
            <MenuItem value="3">Critical risk</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="code-select-label">Select diagnosis codes</InputLabel>
          <Select
            labelId="code-select-label"
            id="code-select"
            multiple
            value={diagnosisCodes}
            onChange={handleCodeSelectChange}
            input={<OutlinedInput id="code-select-input" label="Select diagnosis codes" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={{
              PaperProps: { style: { maxHeight: 50 * 4.5 + 8 }}
            }}
          >
            <MenuItem
              value=""
              sx={{ pointerEvents: 'none', height: 0, margin: 0, padding: 0 }}></MenuItem>
            {diagnosis.map((d) => (
              <MenuItem
                key={d.code}
                value={d.code}
                style={getStyles(d.code, diagnosisCodes, theme)}
              >
                <Typography title={d.latin ?? ''}>{d.code} {d.name}</Typography>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {type === 'Hospital' && (
          <>
            <TextField
              type="date"
              label="Discharge date"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={dischargeDate}
              onChange={({ target: { value }}) => setDischargeDate(value)} />
            <TextField
              label="Discharge criteria"
              required
              fullWidth
              value={dischargeCriteria}
              onChange={({ target: { value }}) => setDischargeCriteria(value)} />
          </>
        )}
        {type === 'OccupationalHealthcare' && (
          <>
            <TextField
              type="date"
              label="Sick leave start date"
              required={Boolean(sickLeaveEndDate)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveStartDate}
              onChange={({ target: { value }}) => setSickLeaveStartDate(value)} />
            <TextField
              type="date"
              label="Sick leave end date"
              required={Boolean(sickLeaveStartDate)}
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={sickLeaveEndDate}
              onChange={({ target: { value }}) => setSickLeaveEndDate(value)} />
            <TextField
              label="Employer name"
              required
              fullWidth
              value={employerName}
              onChange={({ target: { value }}) => setEmployerName(value)} />
          </>
        )}
        <Box sx={{ display: 'flex' }}>
          <Button
            type="button"
            color="secondary"
            variant="contained"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ marginInlineStart: 'auto' }}
          >
            Add
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AddEntryForm;
