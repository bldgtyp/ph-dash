import { Tooltip } from '@mui/material';

/**
 * Applies a specific style to a data sheet checkbox based on the provided value.
 * @param value - The value to determine the style for.
 */
function specificationCheckboxStyle(value?: string) {
    if (value === 'NEEDED') {
        return { checked: false, style: 'checkbox-needed' };
    } else if (value === 'COMPLETE') {
        return { checked: true, style: 'checkbox-checked' };
    } else if (value === 'QUESTION') {
        return { checked: false, style: 'checkbox-question' };
    }
    return { checked: false, style: 'checkbox-na' };
}

/**
 * Renders a checkbox component for a specification.
 * @param params - The parameters for the checkbox component.
 * @param params.value - The value of the checkbox.
 * @param params.row - The row data for the checkbox.
 * @returns The rendered checkbox component.
 */
export const CheckboxForSpecification: React.FC<{ value?: string; row: any }> = ({ value, row }) => {
    const { style } = specificationCheckboxStyle(value);
    return (
        <Tooltip title={row.FLAG}>
            <div className="checkbox-cell">
                <div className={style} />
            </div>
        </Tooltip>
    );
};
