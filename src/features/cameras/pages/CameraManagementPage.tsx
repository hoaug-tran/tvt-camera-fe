import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Pagination,
} from "@mui/material";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Navbar } from "@layouts/header/Navbar";
import { useCameraManagement } from "@features/cameras/hooks/useCameraManagement";
import type {
  CameraDevice,
  CreateCameraRequest,
  PatchCameraRequest,
} from "@features/cameras/types/camera.types";
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

interface PatchFormState {
  udCameraDeviceIdDauGhi: string;
  udCameraDeviceIdChanel: string;
  udCameraDeviceUsername: string;
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

const defaultPatchForm: PatchFormState = {
  udCameraDeviceIdDauGhi: "",
  udCameraDeviceIdChanel: "",
  udCameraDeviceUsername: "",
};

export const CameraManagementPage = () => {
  const {
    cameras,
    loading,
    error,
    page,
    totalPages,
    fetchCameras,
    createCamera,
    patchCamera,
    deleteCamera,
  } = useCameraManagement();

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCamera, setSelectedCamera] = useState<CameraDevice | null>(
    null,
  );
  const [createForm, setCreateForm] =
    useState<CreateFormState>(defaultCreateForm);
  const [patchForm, setPatchForm] = useState<PatchFormState>(defaultPatchForm);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const handleCreateOpen = () => {
    setCreateForm(defaultCreateForm);
    setFormError(null);
    setCreateOpen(true);
  };

  const handleEditOpen = (camera: CameraDevice) => {
    setSelectedCamera(camera);
    setPatchForm({
      udCameraDeviceIdDauGhi: camera.udCameraDeviceIdDauGhi?.toString() ?? "",
      udCameraDeviceIdChanel: camera.udCameraDeviceIdChanel?.toString() ?? "",
      udCameraDeviceUsername: camera.udCameraDeviceUsername ?? "",
    });
    setFormError(null);
    setEditOpen(true);
  };

  const handleDeleteOpen = (camera: CameraDevice) => {
    setSelectedCamera(camera);
    setDeleteOpen(true);
  };

  const handleCreateSubmit = async () => {
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

    const success = await createCamera(data);
    if (success) {
      setCreateOpen(false);
      setCreateForm(defaultCreateForm);
    } else {
      setFormError("Tạo camera thất bại. Vui lòng thử lại.");
    }
  };

  const handlePatchSubmit = async () => {
    if (!selectedCamera) return;
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

    const success = await patchCamera(selectedCamera.udCameraDeviceID, data);
    if (success) {
      setEditOpen(false);
      setSelectedCamera(null);
    } else {
      setFormError("Cập nhật camera thất bại. Vui lòng thử lại.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCamera) return;
    const success = await deleteCamera(selectedCamera.udCameraDeviceID);
    if (success) {
      setDeleteOpen(false);
      setSelectedCamera(null);
    }
  };

  const getCameraDisplayName = (camera: CameraDevice) =>
    camera.udCameraDeviceSuDung?.trim() || `Camera ${camera.udCameraDeviceID}`;

  const getStatusChip = (status: number | null) => (
    <Chip
      label={status === 1 ? "Online" : "Offline"}
      size="small"
      sx={{
        bgcolor:
          status === 1 ? "rgba(107, 168, 47, 0.2)" : "rgba(100, 100, 100, 0.2)",
        color: status === 1 ? "#6ba82f" : darkPalette.neutral[400],
        fontWeight: 600,
        fontSize: "0.75rem",
      }}
    />
  );

  const tableCellSx = {
    color: darkPalette.neutral[300],
    borderBottom: `1px solid ${darkPalette.divider}`,
    fontSize: "0.85rem",
  };

  const tableHeadCellSx = {
    color: darkPalette.neutral[400],
    borderBottom: `1px solid ${darkPalette.divider}`,
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    bgcolor: darkPalette.background.surface,
  };

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

  return (
    <>
      <Navbar />
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          bgcolor: darkPalette.background.default,
          p: 3,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography
            variant="h5"
            sx={{ color: darkPalette.neutral[50], fontWeight: 700 }}
          >
            Quản lý Camera
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleCreateOpen}
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
            Thêm Camera
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: darkPalette.background.surface,
            border: `1px solid ${darkPalette.divider}`,
            borderRadius: "8px",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadCellSx}>ID</TableCell>
                <TableCell sx={tableHeadCellSx}>Tên / Mô tả</TableCell>
                <TableCell sx={tableHeadCellSx}>Đầu ghi</TableCell>
                <TableCell sx={tableHeadCellSx}>Kênh</TableCell>
                <TableCell sx={tableHeadCellSx}>Username</TableCell>
                <TableCell sx={tableHeadCellSx}>Trạng thái</TableCell>
                <TableCell sx={tableHeadCellSx}>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ ...tableCellSx, textAlign: "center", py: 4 }}
                  >
                    <CircularProgress
                      size={24}
                      sx={{ color: darkPalette.secondary.main }}
                    />
                  </TableCell>
                </TableRow>
              )}
              {!loading && cameras.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ ...tableCellSx, textAlign: "center", py: 4 }}
                  >
                    Chưa có camera nào
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                cameras.map((camera) => (
                  <TableRow
                    key={camera.udCameraDeviceID}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                      transition: "background 0.15s ease",
                    }}
                  >
                    <TableCell sx={tableCellSx}>
                      {camera.udCameraDeviceID}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableCellSx,
                        color: darkPalette.neutral[50],
                        fontWeight: 500,
                      }}
                    >
                      {getCameraDisplayName(camera)}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                      {camera.udCameraDeviceIdDauGhi ?? "-"}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                      {camera.udCameraDeviceIdChanel ?? "-"}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                      {camera.udCameraDeviceUsername ?? "-"}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                      {getStatusChip(camera.udCameraDeviceConnectionStatus)}
                    </TableCell>
                    <TableCell sx={tableCellSx}>
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditOpen(camera)}
                          sx={{
                            color: darkPalette.secondary.main,
                            "&:hover": { bgcolor: "rgba(232, 92, 74, 0.1)" },
                          }}
                        >
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteOpen(camera)}
                          sx={{
                            color: darkPalette.semantic?.error ?? "#ef4444",
                            "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                          }}
                        >
                          <Trash2 size={16} />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => fetchCameras(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: darkPalette.neutral[400],
                  "&.Mui-selected": {
                    bgcolor: darkPalette.secondary.main,
                    color: "#fff",
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
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
            onClick={() => setCreateOpen(false)}
            sx={{ color: darkPalette.neutral[400], textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleCreateSubmit}
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

      <Dialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
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
          Chỉnh sửa Camera #{selectedCamera?.udCameraDeviceID}
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
            onClick={() => setEditOpen(false)}
            sx={{ color: darkPalette.neutral[400], textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handlePatchSubmit}
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
              "Lưu thay đổi"
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
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
              {selectedCamera ? getCameraDisplayName(selectedCamera) : ""}
            </strong>
            ? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setDeleteOpen(false)}
            sx={{ color: darkPalette.neutral[400], textTransform: "none" }}
          >
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={handleDeleteConfirm}
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
    </>
  );
};

export default CameraManagementPage;
