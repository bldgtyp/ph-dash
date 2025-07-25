import { useEffect, useRef, useContext } from 'react';

import { UserContext } from '../../../../../auth/_contexts/UserContext';

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Divider,
    ButtonGroup,
} from '@mui/material';
import { OkCancelButtonsProps, HeightInputProps, DeleteButtonProps, LayerHeightModalType } from './LayerHeight.Types';
import { useUnitConversion } from '../../../../_hooks/useUnitConversion';

const HeightInput: React.FC<HeightInputProps> = props => {
    const userContext = useContext(UserContext);
    const { valueInCurrentUnitSystemWithDecimal, valueInSIUnits, unitSystem } = useUnitConversion();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.select();
        }
    }, []);

    return (
        <>
            <TextField
                type="number"
                slotProps={{
                    htmlInput: { step: 'any' },
                }}
                label={`Layer Height [${unitSystem === 'SI' ? 'mm' : 'inch'}]`}
                defaultValue={Number(
                    valueInCurrentUnitSystemWithDecimal(
                        props.layerThicknessUserInput,
                        'mm',
                        'in',
                        unitSystem === 'SI' ? 1 : 3
                    )
                )}
                onChange={e => {
                    props.handleLayerThicknessUserInputChange({
                        thickness_mm: valueInSIUnits(Number(e.target.value), 'mm', 'in'),
                    });
                }}
                fullWidth
                margin="dense"
                autoFocus
                inputRef={inputRef}
                disabled={!userContext.user}
            />
        </>
    );
};

const OkCancelButtons: React.FC<OkCancelButtonsProps> = props => {
    return (
        <DialogActions sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <ButtonGroup variant="text">
                <Button onClick={props.handleModalClose} size="large" color="primary">
                    Cancel
                </Button>
                <Button type="submit" size="large" color="primary">
                    Save
                </Button>
            </ButtonGroup>
        </DialogActions>
    );
};

const DeleteButton: React.FC<DeleteButtonProps> = props => {
    const userContext = useContext(UserContext);
    return (
        <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button
                color="error"
                size="small"
                fullWidth
                variant="outlined"
                disabled={!userContext.user}
                onClick={() => {
                    const isConfirmed = window.confirm('Are you sure you want to delete this Layer?');
                    if (isConfirmed) {
                        props.handleDeleteLayer();
                    }
                }}
            >
                Delete Layer
            </Button>
        </DialogActions>
    );
};

const ModalLayerThickness: React.FC<LayerHeightModalType> = props => {
    return (
        <Dialog open={props.isModalOpen} onClose={props.onModalClose}>
            <DialogTitle>Layer</DialogTitle>
            <Divider />
            <form
                onSubmit={e => {
                    e.preventDefault();
                    props.onSubmit();
                }}
            >
                <DialogContent>
                    <HeightInput
                        layerThicknessUserInput={props.layerThickness}
                        handleLayerThicknessUserInputChange={props.onLayerThicknessChange}
                    />
                </DialogContent>
                <OkCancelButtons handleModalClose={props.onModalClose} />
            </form>
            <Divider />
            <DeleteButton handleDeleteLayer={props.onDeleteLayer} />
        </Dialog>
    );
};

export default ModalLayerThickness;
