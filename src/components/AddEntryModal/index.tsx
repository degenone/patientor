import { Alert, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { Diagnosis, EntryFromValues } from "../../types";
import AddEntryForm from "./AddEntryForm";

interface Props {
  modalOpen: boolean;
  onClose: () => void;
  error?: string;
  onSubmit: (values: EntryFromValues) => void;
  diagnosis: Diagnosis[];
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error, diagnosis }: Props) => {
  return (
    <Dialog fullWidth={true} open={modalOpen} onClose={() => onClose()}>
      <DialogTitle>Add a new entry to this patient</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <AddEntryForm onSubmit={onSubmit} onCancel={onClose} diagnosis={diagnosis} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEntryModal;
