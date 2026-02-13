/** Confirmation dialog before running optimization. */
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function OptimizeDialog(props: {
  optimizeDialog: boolean;
  SetOptimizeDialog: (value: boolean) => void;
  FetchButtonClick: () => void;
}) {
  const HandleClose = () => {
    props.SetOptimizeDialog(false);
  };

  return (
    <Dialog
      open={props.optimizeDialog}
      onClose={HandleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Search for optimal model settings
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This may take 10–30 minutes. Results will be applied to the screen when done.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, color: "warning.main" }}>
          Do not close the browser while processing.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.FetchButtonClick} variant="contained">Run</Button>
        <Button onClick={HandleClose} autoFocus>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}
