import { Patient } from "../../types";

interface Props {
  patient : Patient | undefined
}

const PatientPage = ({ patient }: Props ) => {
  if (!patient) {
    return null;
  }
  return (
    <div className="app">

    </div>
  );
};

export default PatientPage;
