import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box } from "@mui/material";
import DataViewPage from "../../shared/components/DataViewPage";
import { fetchWithAlert } from "../../../../../api/fetchData";
import AssembliesDataDashboardTabBar from "./AssembliesDataDashboardTabBar";
import ContentBlock from "../../shared/components/ContentBlock";
import MaterialsDataGrid from "./MaterialsDataGrid";
import { ProjectType, defaultProjectType } from "../../../../types/Project";


export default function AssemblyDataDashboard(params: any) {
    const { projectId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [projectData, setProjectData] = useState<ProjectType>(defaultProjectType);
    const [activeTab, setActiveTab] = useState(0);

    useEffect(() => {
        async function loadProjectData() {
            try {
                const d = await fetchWithAlert<ProjectType>(`project/${projectId}`)
                setProjectData(d || defaultProjectType)
            } catch (error) {
                alert("Error loading project data. Please try again later.");
                console.error("Error loading project data:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadProjectData();
    }, [projectId])

    const handleTabChange = (newTab: number) => {
        setActiveTab(newTab);
    };

    return (
        <>
            {isLoading ? (
                <div>Loading Project Data</div>
            ) : (
                <Box id="assemblies-data-dashboard">
                    <AssembliesDataDashboardTabBar projectId={projectId!} activeTab={activeTab} onTabChange={handleTabChange} />
                    <DataViewPage>
                        <ContentBlock>
                            {activeTab === 0 && <MaterialsDataGrid />}
                        </ContentBlock>
                    </DataViewPage>
                </Box>
            )}
        </>
    )
}