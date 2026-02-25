import { useEffect, useReducer } from "react";
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
  Alert,
  CircularProgress,
  Stack,
  Chip,
  Pagination,
} from "@mui/material";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Navbar } from "@layouts/header/Navbar";
import { useCameraManagement } from "@features/cameras/hooks/useCameraManagement";
import type { CameraDevice } from "@features/cameras/types/camera.types";
import { darkPalette } from "@themes/palette";
import { CreateCameraDialog } from "./CreateCameraDialog";
import { EditCameraDialog } from "./EditCameraDialog";
import { DeleteCameraDialog } from "./DeleteCameraDialog";

type DialogAction =
  | { type: "OPEN_CREATE" }
  | { type: "CLOSE_CREATE" }
  | { type: "OPEN_EDIT"; camera: CameraDevice }
  | { type: "CLOSE_EDIT" }
  | { type: "OPEN_DELETE"; camera: CameraDevice }
  | { type: "CLOSE_DELETE" };

type DialogState = {
  createOpen: boolean;
  editOpen: boolean;
  deleteOpen: boolean;
  selectedCamera: CameraDevice | null;
};

const initialDialogState: DialogState = {
  createOpen: false,
  editOpen: false,
  deleteOpen: false,
  selectedCamera: null,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case "OPEN_CREATE":
      return { ...state, createOpen: true };
    case "CLOSE_CREATE":
      return { ...state, createOpen: false };
    case "OPEN_EDIT":
      return { ...state, editOpen: true, selectedCamera: action.camera };
    case "CLOSE_EDIT":
      return { ...state, editOpen: false, selectedCamera: null };
    case "OPEN_DELETE":
      return { ...state, deleteOpen: true, selectedCamera: action.camera };
    case "CLOSE_DELETE":
      return { ...state, deleteOpen: false, selectedCamera: null };
    default:
      return state;
  }
}

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

  const [dialog, dispatch] = useReducer(dialogReducer, initialDialogState);

  useEffect(() => {
    fetchCameras();
  }, [fetchCameras]);

  const handleDeleteConfirm = async () => {
    if (!dialog.selectedCamera) return;
    const success = await deleteCamera(dialog.selectedCamera.udCameraDeviceID);
    if (success) {
      dispatch({ type: "CLOSE_DELETE" });
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
            onClick={() => dispatch({ type: "OPEN_CREATE" })}
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
                          onClick={() =>
                            dispatch({ type: "OPEN_EDIT", camera })
                          }
                          sx={{
                            color: darkPalette.secondary.main,
                            "&:hover": { bgcolor: "rgba(232, 92, 74, 0.1)" },
                          }}
                        >
                          <Pencil size={16} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            dispatch({ type: "OPEN_DELETE", camera })
                          }
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

      <CreateCameraDialog
        open={dialog.createOpen}
        loading={loading}
        onClose={() => dispatch({ type: "CLOSE_CREATE" })}
        onSubmit={createCamera}
      />

      <EditCameraDialog
        key={dialog.selectedCamera?.udCameraDeviceID ?? "none"}
        open={dialog.editOpen}
        loading={loading}
        camera={dialog.selectedCamera}
        onClose={() => dispatch({ type: "CLOSE_EDIT" })}
        onSubmit={patchCamera}
      />

      <DeleteCameraDialog
        open={dialog.deleteOpen}
        loading={loading}
        camera={dialog.selectedCamera}
        cameraDisplayName={
          dialog.selectedCamera
            ? getCameraDisplayName(dialog.selectedCamera)
            : ""
        }
        onClose={() => dispatch({ type: "CLOSE_DELETE" })}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
