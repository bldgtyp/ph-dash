import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import StyledDataGrid from "../../../_styles/DataGrid";
import { generateGridColumns, generateDefaultRow } from "../../../_components/DataGridFunctions";
import ContentBlockHeader from "../../../_components/ContentBlockHeader";
import LoadingModal from "../../../_components/LoadingModal";
import useLoadDataGridFromAirTable from "../../../../model_viewer/_hooks/useLoadDataGridFromAirTable";
import { useDynamicColumns } from "../../../_hooks/useDynamicColumns";
import tableFields from "./WindowUnit.TableFields";
import { WindowUnitTypesRecord } from "../../types/WindowUnits";


// Create the columns object based on tableFields and then
// create an Array with a default single row, with all '-' cells.
// This will display while the data is being fetched
const columns = generateGridColumns(tableFields);
const defaultRow = generateDefaultRow(tableFields);

const WindowUnitDataGrid: React.FC = () => {
  // Load in the table data from the Database
  const { projectId } = useParams();
  const { showModal, rowData } = useLoadDataGridFromAirTable<WindowUnitTypesRecord>(
    defaultRow,
    "window_units",
    projectId
  );

  // --------------------------------------------------------------------------
  // Update columns dynamically when rowData changes
  const adjustedColumns = useDynamicColumns(
    columns,
    rowData,
    [
      "DISPLAY_NAME",
      "OPERATION",
      "GLAZING_NAME",
      "FRAME ELEMENT NAME: LEFT",
      "FRAME ELEMENT NAME: RIGHT",
      "FRAME ELEMENT NAME: TOP",
      "FRAME ELEMENT NAME: BOTTOM",
    ]
  );

  // --------------------------------------------------------------------------
  // Render the component
  return (
    <>
      {" "}
      <LoadingModal showModal={showModal} />
      <ContentBlockHeader text="Window & Door Unit Types" />
      <Box>
        <StyledDataGrid
          rows={rowData}
          columns={adjustedColumns}
        />
      </Box>
    </>
  );
}

export default WindowUnitDataGrid;
