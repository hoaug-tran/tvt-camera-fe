import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Stack,
} from "@mui/material";
import type {
  CameraDevice,
  PatchCameraRequest,
} from "@features/cameras/types/camera.types";
import { darkPalette } from "@themes/palette";

interface PatchFormState {
  udCameraDeviceIdDauGhi: string;
  udCameraDeviceIdChanel: string;
  udCameraDeviceUsername: string;
}

const defaultPatchForm: PatchFormState = {
  udCameraDeviceIdDauGhi: "",
  udCameraDeviceIdChanel: "",
  udCameraDeviceUsername: "",
};

interface EditCameraDialogProps {
  open: boolean;
  loading: boolean;
  camera: CameraDevice | null;
  onClose: () => void;
  onSubmit: (id: number, data: PatchCameraRequest) => Promise<boolean>;
}

export const EditCameraDialog = ({
  open,
  loading,
  camera,
  onClose,
  onSubmit,
}: EditCameraDialogProps) => {
  const [patchForm, setPatchForm] = useState<PatchFormState>(() =>
    camera
      ? {
          udCameraDeviceIdDauGhi:
            camera.udCameraDeviceIdDauGhi?.toString() ?? "",
          udCameraDeviceIdChanel:
            camera.udCameraDeviceIdChanel?.toString() ?? "",
          udCameraDeviceUsername: camera.udCameraDeviceUsername ?? "",
        }
      : defaultPatchForm,
  );
  const [formError, setFormError] = useState<string | null>(null);

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      color: darkPalette.neutral[50],
      "& fieldset": { borderColor: darkPalette.divider },
      "&:hover fieldset": { borderColor: darkPalette.secondary.main },
      "&.Mui-focused fieldset": { borderColor: darkPalette.secondary.main },
    },
    "& .MuiInputLabel-root": { color: darkPalette.neutral[400] },
    "& .MuiInputLabel-root.Mui-focused": { color: darkPalette.secondary.main },
  };

  const handleSubmit = async () => {
    if (!camera) return;
    setFormError(null);

    const data: PatchCameraRequest = {
      udCameraDeviceIdDauGhi: patchForm.udCameraDeviceIdDauGhi
        ? parseInt(patchForm.udCameraDeviceIdDauGhi)
        : undefined,
      udCameraDeviceIdChanel: patchForm.udCameraDeviceIdChanel
        ? parseInt(patchForm.udCameraDeviceIdChanel)
        : undefined,
      udCameraDeviceUsername: patchForm.udCameraDeviceUsername || undefined,
    };

    const success = await onSubmit(camera.udCameraDeviceID, data);
    if (success) {
      onClose();
    } else {
      setFormError("Cập nhật camera thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
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
        Chỉnh sửa Camera #{camera?.udCameraDeviceID}
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="ID Đầu ghi"
            type="number"
            value={patchForm.udCameraDeviceIdDauGhi}
            onChange={(e) =>
              setPatchForm((f) => ({
                ...f,
                udCameraDeviceIdDauGhi: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="Kênh"
            type="number"
            value={patchForm.udCameraDeviceIdChanel}
            onChange={(e) =>
              setPatchForm((f) => ({
                ...f,
                udCameraDeviceIdChanel: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="Username"
            value={patchForm.udCameraDeviceUsername}
            onChange={(e) =>
              setPatchForm((f) => ({
                ...f,
                udCameraDeviceUsername: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
        </Stack>
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
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            bgcolor: darkPalette.secondary.main,
            "&:hover": {
              bgcolor: darkPalette.secondary.dark ?? darkPalette.secondary.main,
            },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Lưu thay đổi"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
