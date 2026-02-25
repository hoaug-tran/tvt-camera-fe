import { Stack, IconButton, Box, Typography } from "@mui/material";
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";

interface PTZControlsProps {
  onMove?: (direction: "up" | "down" | "left" | "right") => void;
  onZoom?: (direction: "in" | "out") => void;
  disabled?: boolean;
}

const PTZControls = ({
  onMove,
  onZoom,
  disabled = false,
}: PTZControlsProps) => {
  return (
    <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
      {/* Pan/Tilt Controls */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="caption" sx={{ textAlign: "center", mb: 0.5 }}>
          Pan/Tilt
        </Typography>
        <Stack spacing={0.5}>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              size="small"
              onClick={() => onMove?.("up")}
              disabled={disabled}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronUp size={18} />
            </IconButton>
          </Box>
          <Stack direction="row" spacing={0.5}>
            <IconButton
              size="small"
              onClick={() => onMove?.("left")}
              disabled={disabled}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronLeft size={18} />
            </IconButton>
            <Box sx={{ width: 40 }} />
            <IconButton
              size="small"
              onClick={() => onMove?.("right")}
              disabled={disabled}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronRight size={18} />
            </IconButton>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <IconButton
              size="small"
              onClick={() => onMove?.("down")}
              disabled={disabled}
              sx={{
                "&:hover": { bgcolor: "action.hover" },
              }}
            >
              <ChevronDown size={18} />
            </IconButton>
          </Box>
        </Stack>
      </Box>

      {/* Zoom Controls */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography variant="caption" sx={{ textAlign: "center", mb: 0.5 }}>
          Zoom
        </Typography>
        <Stack spacing={0.5}>
          <IconButton
            size="small"
            onClick={() => onZoom?.("in")}
            disabled={disabled}
            sx={{
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Plus size={18} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => onZoom?.("out")}
            disabled={disabled}
            sx={{
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <Minus size={18} />
          </IconButton>
        </Stack>
      </Box>
    </Box>
  );
};

export default PTZControls;
