import { fetchWithAlert } from "./fetchData";
import { hbFace } from "../features/project_view/model_viewer/types/honeybee/face";
import { hbPhSpace } from "../features/project_view/model_viewer/types/honeybee_ph/space";
import { lbtSunPathAndCompass } from "../features/project_view/model_viewer/types/ladybug/sunpath";
import { hbPhHvacHotWaterSystem } from "../features/project_view/model_viewer/types/honeybee_phhvac/hot_water_system";
import { hbPhHvacVentilationSystem } from "../features/project_view/model_viewer/types/honeybee_phhvac/ventilation";
import { hbShadeGroup } from "../features/project_view/model_viewer/types/honeybee/shade";

/**
 * Fetches the 3D-Model data for a specified project.
 * @param projectId - The ID of the project.
 * @returns An object containing the fetched model data, including faces, spaces, sun path data,
 * hot water system data, ventilation system data, and shading elements data.
 * Returns null if there was an error during the fetch.
 */
export async function fetchModelData(projectId: string) {
    try {
        console.log(`fetchModelData(projectId=${projectId})`)

        // TODO: this should be done automatically on the server when any model data is accessed
        // const routeLoadModel = `${projectId}/load_hb_model`;
        // const modelData = await fetchWithAlert<hbFace[]>(routeLoadModel);
        // if (!modelData) { return null }

        const facesData = await fetchWithAlert<hbFace[]>(`hb_model/${projectId}/faces`);
        const spacesData = await fetchWithAlert<hbPhSpace[]>(`hb_model/${projectId}/spaces`);
        const sunPathData = await fetchWithAlert<lbtSunPathAndCompass[]>(`hb_model/${projectId}/sun_path`);
        const hotWaterSystemData = await fetchWithAlert<hbPhHvacHotWaterSystem[]>(`hb_model/${projectId}/hot_water_systems`);
        const ventilationSystemData = await fetchWithAlert<hbPhHvacVentilationSystem[]>(`hb_model/${projectId}/ventilation_systems`);
        const shadingElementsData = await fetchWithAlert<hbShadeGroup[]>(`hb_model/${projectId}/shading_elements`);

        return { facesData, spacesData, sunPathData, hotWaterSystemData, ventilationSystemData, shadingElementsData };
    } catch (error) {
        console.error(error);
        return null;
    }
}
