import { useState, useEffect } from 'react';
import { Box, Stack } from '@mui/material';
import StyledDataGrid from '../_styles/DataGrid';
import { generateGridColumns } from '../_components/DataGridFunctions';
import { TooltipWithInfo } from '../_components/TooltipWithInfo';

type DataGridRow = {
    key: string;
    id: string;
    display_name: string;
    unit: string;
    [key: string]: any;
};

// --------------------------------------------------------------------------
// Define the rows and columns
const tableFields = [
    {
        key: 'display_name',
        field: 'display_name',
        headerName: 'Name',
        flex: 1,
        renderCell: (params: any) => TooltipWithInfo(params),
    },
    {
        key: 'unit',
        field: 'unit',
        headerName: 'Unit',
        flex: 0.5,
    },
];

type propsType = {
    title: string;
    rowData: DataGridRow[];
};

const ResultDataGrid: React.FC<propsType> = ({ title, rowData }) => {
    const [columns, setColumns] = useState(generateGridColumns(tableFields));

    // Once the data is finished downloading and props is updated...
    useEffect(() => {
        // Add in the user-determined result columns, if any
        if (rowData.length > 0) {
            for (const [newKey] of Object.entries(rowData[0])) {
                if (newKey.includes('RESULT')) {
                    // Make sure not to duplicate any columns
                    const tableExistingColumnNames = tableFields.map(item => item.key);
                    if (!tableExistingColumnNames.includes(newKey)) {
                        tableFields.push({
                            key: newKey,
                            field: newKey,
                            headerName: newKey,
                            flex: 1,
                            renderCell: (num: any) => {
                                if (num.row[newKey] !== undefined) {
                                    return <>{num.row[newKey].toLocaleString()}</>;
                                } else {
                                    return <></>;
                                }
                            },
                        });
                    }
                }
            }
            setColumns(generateGridColumns(tableFields));
        }
    }, [rowData]);

    // --------------------------------------------------------------------------
    return (
        <>
            <Stack className="content-block-heading" spacing={1}>
                <h3>{title}:</h3>
            </Stack>
            <Box>
                <StyledDataGrid
                    rows={rowData}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                        },
                    }}
                    pageSizeOptions={[10, 100]}
                    checkboxSelection
                />
            </Box>
        </>
    );
};
export default ResultDataGrid;
