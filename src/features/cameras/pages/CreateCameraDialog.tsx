import { useState, useEffect } from "react";
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
import type { CreateCameraRequest } from "@features/cameras/types/camera.types";
import { darkPalette } from "@themes/palette";

interface CreateFormState {
  udCameraDeviceIpAdress: string;
  udCameraDevicePort: string;
  udCameraDeviceUsername: string;
  udCameraDevicePassword: string;
  udCameraDeviceIdDauGhi: string;
  udCameraDeviceIdChanel: string;
  udCameraDeviceSuDung: string;
}

const defaultCreateForm: CreateFormState = {
  udCameraDeviceIpAdress: "",
  udCameraDevicePort: "",
  udCameraDeviceUsername: "",
  udCameraDevicePassword: "",
  udCameraDeviceIdDauGhi: "",
  udCameraDeviceIdChanel: "",
  udCameraDeviceSuDung: "",
};

interface CreateCameraDialogProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
  onSubmit: (data: CreateCameraRequest) => Promise<boolean>;
}

export const CreateCameraDialog = ({
  open,
  loading,
  onClose,
  onSubmit,
}: CreateCameraDialogProps) => {
  const [createForm, setCreateForm] =
    useState<CreateFormState>(defaultCreateForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setCreateForm(defaultCreateForm);
      setFormError(null);
    }
  }, [open]);

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
    setFormError(null);
    const port = createForm.udCameraDevicePort
      ? parseInt(createForm.udCameraDevicePort)
      : undefined;

    if (port !== undefined && (isNaN(port) || port < 1 || port > 65535)) {
      setFormError("Port phải là số từ 1 đến 65535");
      return;
    }

    const data: CreateCameraRequest = {
      udCameraDeviceIpAdress: createForm.udCameraDeviceIpAdress || undefined,
      udCameraDevicePort: port,
      udCameraDeviceUsername: createForm.udCameraDeviceUsername || undefined,
      udCameraDevicePassword: createForm.udCameraDevicePassword || undefined,
      udCameraDeviceIdDauGhi: createForm.udCameraDeviceIdDauGhi
        ? parseInt(createForm.udCameraDeviceIdDauGhi)
        : undefined,
      udCameraDeviceIdChanel: createForm.udCameraDeviceIdChanel
        ? parseInt(createForm.udCameraDeviceIdChanel)
        : undefined,
      udCameraDeviceSuDung: createForm.udCameraDeviceSuDung || undefined,
    };

    const success = await onSubmit(data);
    if (success) {
      setCreateForm(defaultCreateForm);
      onClose();
    } else {
      setFormError("Tạo camera thất bại. Vui lòng thử lại.");
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
        Thêm Camera Mới
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {formError && <Alert severity="error">{formError}</Alert>}
          <TextField
            label="Mô tả / Tên camera"
            value={createForm.udCameraDeviceSuDung}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDeviceSuDung: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="IP Address"
            value={createForm.udCameraDeviceIpAdress}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDeviceIpAdress: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="Port"
            type="number"
            value={createForm.udCameraDevicePort}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDevicePort: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="Username"
            value={createForm.udCameraDeviceUsername}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDeviceUsername: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="Password"
            type="password"
            value={createForm.udCameraDevicePassword}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDevicePassword: e.target.value,
              }))
            }
            fullWidth
            size="small"
            sx={textFieldSx}
          />
          <TextField
            label="ID Đầu ghi"
            type="number"
            value={createForm.udCameraDeviceIdDauGhi}
            onChange={(e) =>
              setCreateForm((f) => ({
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
            value={createForm.udCameraDeviceIdChanel}
            onChange={(e) =>
              setCreateForm((f) => ({
                ...f,
                udCameraDeviceIdChanel: e.target.value,
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
              bgcolor:
                darkPalette.secondary.dark ?? darkPalette.secondary.main,
            },
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Tạo Camera"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
