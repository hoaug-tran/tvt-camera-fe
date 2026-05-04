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
  Tooltip,
} from "@mui/material";
import { Plus, Pencil, Trash2, ArrowLeft } from "lucide-react";
import { Navbar } from "@layouts/header/Navbar";
import { useCameraManagement } from "@features/cameras/hooks/useCameraManagement";
import type { CameraDevice } from "@features/cameras/types/camera.types";
import { darkPalette } from "@themes/palette";
import { CreateCameraDialog } from "./CreateCameraDialog";
import { EditCameraDialog } from "./EditCameraDialog";
import { DeleteCameraDialog } from "./DeleteCameraDialog";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
          status === 1
            ? "rgba(107, 168, 47, 0.15)"
            : "rgba(100, 100, 100, 0.1)",
        color: status === 1 ? "#6ba82f" : darkPalette.neutral[400],
        fontWeight: 700,
        fontSize: "0.7rem",
        height: 20,
      }}
    />
  );

  const tableCellSx = {
    color: darkPalette.neutral[300],
    borderBottom: `1px solid ${darkPalette.divider}`,
    fontSize: "0.85rem",
    py: 1.2,
  };

  const tableHeadCellSx = {
    color: darkPalette.neutral[400],
    borderBottom: `1px solid ${darkPalette.divider}`,
    fontWeight: 700,
    fontSize: "0.75rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px",
    bgcolor: darkPalette.background.surface,
    py: 1.5,
  };

  return (
    <Box sx={{ bgcolor: darkPalette.background.default, minHeight: "100vh" }}>
      <Navbar />

      <Box
        sx={{
          pt: { xs: "72px", sm: "88px" },
          pb: 4,
          px: { xs: 2, sm: 4 },
          mx: "auto",
          maxWidth: "1400px",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
          mb={4}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Tooltip title="Quay về trang chủ">
              <IconButton
                onClick={() => navigate("/home")}
                sx={{
                  bgcolor: "rgba(255,255,255,0.05)",
                  color: darkPalette.neutral[300],
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.1)",
                    transform: "translateX(-2px)",
                  },
                  transition: "all 0.2s",
                }}
              >
                <ArrowLeft size={20} />
              </IconButton>
            </Tooltip>
            <Typography
              variant="h5"
              sx={{
                color: darkPalette.neutral[50],
                fontWeight: 800,
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              }}
            >
              Quản lý Camera
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => dispatch({ type: "OPEN_CREATE" })}
            sx={{
              bgcolor: darkPalette.secondary.main,
              "&:hover": {
                bgcolor: darkPalette.secondary.dark,
                transform: "translateY(-1px)",
                boxShadow: `0 4px 12px rgba(232, 92, 74, 0.3)`,
              },
              textTransform: "none",
              fontWeight: 700,
              borderRadius: 2,
              px: { xs: 2.5, sm: 3 },
              py: 1,
              width: { xs: "100%", sm: "auto" },
            }}
          >
            Thêm Camera
          </Button>
        </Stack>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer
          component={Paper}
          sx={{
            bgcolor: darkPalette.background.surface,
            backgroundImage: "none",
            border: `1px solid ${darkPalette.divider}`,
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeadCellSx}>ID</TableCell>
                <TableCell sx={tableHeadCellSx}>Tên / Mô tả</TableCell>
                <TableCell sx={tableHeadCellSx}>Đầu ghi</TableCell>
                <TableCell sx={tableHeadCellSx}>Kênh</TableCell>
                <TableCell sx={tableHeadCellSx}>Username</TableCell>
                <TableCell sx={tableHeadCellSx}>Trạng thái</TableCell>
                <TableCell sx={tableHeadCellSx} align="right">
                  Thao tác
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{ ...tableCellSx, textAlign: "center", py: 8 }}
                  >
                    <CircularProgress
                      size={32}
                      sx={{ color: darkPalette.secondary.main }}
                    />
                  </TableCell>
                </TableRow>
              )}
              {!loading && cameras.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    sx={{
                      ...tableCellSx,
                      textAlign: "center",
                      py: 8,
                      color: darkPalette.neutral[500],
                    }}
                  >
                    Chưa có thiết bị camera nào được cấu hình
                  </TableCell>
                </TableRow>
              )}
              {!loading &&
                cameras.map((camera) => (
                  <TableRow
                    key={camera.udCameraDeviceID}
                    sx={{
                      "&:hover": { bgcolor: "rgba(255,255,255,0.02)" },
                      transition: "background 0.15s ease",
                    }}
                  >
                    <TableCell sx={{ ...tableCellSx, fontWeight: 700 }}>
                      #{camera.udCameraDeviceID}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...tableCellSx,
                        color: darkPalette.neutral[50],
                        fontWeight: 600,
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
                    <TableCell sx={tableCellSx} align="right">
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="Chỉnh sửa">
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
                            <Pencil size={18} />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton
                            size="small"
                            onClick={() =>
                              dispatch({ type: "OPEN_DELETE", camera })
                            }
                            sx={{
                              color: "#ef4444",
                              "&:hover": { bgcolor: "rgba(239, 68, 68, 0.1)" },
                            }}
                          >
                            <Trash2 size={18} />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => fetchCameras(value)}
              sx={{
                "& .MuiPaginationItem-root": {
                  color: darkPalette.neutral[400],
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: darkPalette.secondary.main,
                    color: "#fff",
                    fontWeight: 700,
                    "&:hover": { bgcolor: darkPalette.secondary.dark },
                  },
                },
              }}
            />
          </Box>
        )}
      </Box>

      <CreateCameraDialog
        key={String(dialog.createOpen)}
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
    </Box>
  );
};
