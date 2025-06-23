// Load and Build the 3D Model to show in the Viewer

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Dialog, Stack, Typography } from '@mui/material';

import { SceneSetup } from './scene_setup/SceneSetup';
import { get3DModelData } from '../../../api/get3DModelData';
import { loadModelFaces } from './loaders/load_faces';
import { loadSpaces } from './loaders/load_spaces';
import { loadSpaceFloors } from './loaders/load_space_floors';
import { loadSunPath } from './loaders/load_sun_path';
import { loadHotWaterPiping } from './loaders/load_hot_water_piping';
import { loadERVDucting } from './loaders/load_erv_ducting';
import { loadShades } from './loaders/load_shades';

/**
 * Handles errors in the specified function.
 *
 * @template T - The type of data being handled.
 * @param _func - The function to handle errors for.
 * @param world - A mutable ref object containing the scene setup.
 * @param data - The data to be processed by the function.
 * @returns An array of results from the function, or an empty array if there was an error or the data is null.
 */
function handleLoadError<T>(_func: any, world: React.RefObject<SceneSetup>, data: T[] | T | null) {
    if (!data) {
        console.error(`ERROR: Something went wrong loading the data for Function: ${_func.name}`);
        return [];
    } else {
        return _func(world, data);
    }
}

type ModelProps = {
    world: React.RefObject<SceneSetup>;
    showModel: boolean;
};

const Model: React.FC<ModelProps> = ({ world, showModel }) => {
    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(true);

    // Load the Model-Elements from the Server based on: team-id / project-id / model-id
    // ------------------------------------------------------------------------
    useEffect(() => {
        async function loadModelDataIntoWorld(projectId: string) {
            console.log('Loading Model Data into World...');

            try {
                const modelData = await get3DModelData(projectId);
                if (modelData === null) {
                    return;
                }
                handleLoadError(loadModelFaces, world, modelData.facesData);
                handleLoadError(loadSpaces, world, modelData.spacesData);
                handleLoadError(loadSpaceFloors, world, modelData.spacesData);
                handleLoadError(loadSunPath, world, modelData.sunPathData);
                handleLoadError(loadHotWaterPiping, world, modelData.hotWaterSystemData);
                handleLoadError(loadERVDucting, world, modelData.ventilationSystemData);
                handleLoadError(loadShades, world, modelData.shadingElementsData);
            } catch (error) {
                alert(`Error loading model data: ${error}`);
            } finally {
                setIsLoading(false);
            }
        }

        world.current.reset();
        if (showModel === true && projectId !== undefined) {
            loadModelDataIntoWorld(projectId);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId, showModel]);

    return (
        <>
            {isLoading && (
                <Dialog className="model-loading" open={isLoading}>
                    <Stack
                        className="model-loading"
                        p={2}
                        sx={{
                            minWidth: '400px',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: 2,
                        }}
                    >
                        <Typography>Please wait while the model is loaded.</Typography>
                        <CircularProgress size={40} />
                        <Typography>For large models this may take some time to download.</Typography>
                    </Stack>
                </Dialog>
            )}
        </>
    );
};
export default Model;
