import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import type { CameraDevice } from "@features/cameras/types/camera.types";
import { darkPalette } from "@themes/palette";

interface DeleteCameraDialogProps {
  open: boolean;
  loading: boolean;
  camera: CameraDevice | null;
  cameraDisplayName: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const DeleteCameraDialog = ({
  open,
  loading,
  cameraDisplayName,
  onClose,
  onConfirm,
}: DeleteCameraDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: darkPalette.background.surface,
          border: `1px solid ${darkPalette.divider}`,
          color: darkPalette.neutral[50],
        },
      }}
    >
      <DialogTitle sx={{ color: darkPalette.neutral[50], fontWeight: 700 }}>
        Xác nhận xóa
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: darkPalette.neutral[300] }}>
          Bạn có chắc muốn xóa{" "}
          <strong style={{ color: darkPalette.neutral[50] }}>
            {cameraDisplayName}
          </strong>
          ? Hành động này không thể hoàn tác.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          onClick={onClose}
          sx={{ color: darkPalette.neutral[400], textTransform: "none" }}
        >
          Hủy
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: darkPalette.semantic?.error ?? "#ef4444",
            "&:hover": { bgcolor: "#dc2626" },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : "Xóa"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
